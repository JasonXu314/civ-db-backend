import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ObjectId, WithId } from 'mongodb';
import { DBService } from 'src/db/db.service';
import { DLCRecord, DLC_STRINGS, MarshallingError, PrerequisiteError } from 'src/utils/common';
import { DeepPartial, deepMerge } from 'src/utils/utils';
import { MarshalledTechnology, Technology } from './technology.model';

@Injectable()
export class TechnologiesService {
	private _logger: ConsoleLogger = new ConsoleLogger('Technologies Service');

	constructor(private _db: DBService) {}

	public async get(): Promise<WithId<Technology>[]> {
		return this._db.technologies.find().toArray();
	}

	public async getById(_id: ObjectId): Promise<WithId<Technology> | null> {
		return this._db.technologies.findOne({ _id });
	}

	public async search(query: string): Promise<WithId<Technology>[]> {
		return this._db.technologies.find({ $text: { $search: query } }, { sort: { score: { $meta: 'textScore' } } }).toArray();
	}

	public async create(tech: Technology): Promise<ObjectId> {
		return (await this._db.technologies.insertOne(tech)).insertedId;
	}

	public async update(_id: ObjectId, data: DeepPartial<Technology>): Promise<WithId<Technology> | null> {
		const existingData = await this.getById(_id);

		if (!existingData) {
			return null;
		}

		return (await this._db.technologies.findOneAndUpdate({ _id }, { $set: deepMerge(existingData, data) })).value;
	}

	public async marshal(tech: WithId<Technology>): Promise<WithId<MarshalledTechnology>>;
	public async marshal(techs: WithId<Technology>[]): Promise<WithId<MarshalledTechnology>[]>;
	public async marshal(techOrTechs: WithId<Technology> | WithId<Technology>[]): Promise<WithId<MarshalledTechnology> | WithId<MarshalledTechnology>[]> {
		if (Array.isArray(techOrTechs)) {
			const techs = techOrTechs;

			return Promise.all(techs.map((tech) => this.marshal(tech)));
		} else {
			const tech = techOrTechs;

			try {
				const prerequisites = await this.getPrerequisites(tech);
				// TODO: add buildings/districts/improvements/units/wonders unlocked when added

				return { ...tech, prerequisites };
			} catch (err: unknown) {
				if (err instanceof PrerequisiteError || err instanceof Error) {
					throw new MarshallingError(err);
				} else {
					this._logger.log(`Encountered error when marshalling technology ${tech._id}`, err);
					throw new MarshallingError('Unknown Error');
				}
			}
		}
	}

	public async getPrerequisites(tech: WithId<Technology>): Promise<DLCRecord<WithId<Technology>[]>> {
		const prerequisites = {
			base: await Promise.all(tech.dependencies.base.map((id) => this.getById(id))),
			rf: await Promise.all(tech.dependencies.rf.map((id) => this.getById(id))),
			gs: await Promise.all(tech.dependencies.gs.map((id) => this.getById(id)))
		};

		for (const dlc of DLC_STRINGS) {
			if (prerequisites[dlc].some((tech) => tech === null)) {
				throw new PrerequisiteError(
					dlc,
					prerequisites[dlc].reduce<ObjectId[]>((missing, prereq, i) => (prereq === null ? [...missing, tech.dependencies[i]] : missing), [])
				);
			}
		}

		return prerequisites as DLCRecord<WithId<Technology>[]>;
	}
}

