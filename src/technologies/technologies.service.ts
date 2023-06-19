import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ObjectId, WithId } from 'mongodb';
import { DBService } from 'src/db/db.service';
import { DLCRecord, DLC_STRINGS, MarshallingError, PrerequisiteError } from 'src/utils/common';
import { DeepPartial, deepMerge, normalizeName, reformatName } from 'src/utils/utils';
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

	public async getByName(name: string): Promise<WithId<Technology> | null> {
		return this._db.technologies.findOne({ name: reformatName(normalizeName(name)) });
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

	public async marshal(tech: WithId<Technology>, hints?: WithId<Technology>[]): Promise<WithId<MarshalledTechnology>>;
	public async marshal(techs: WithId<Technology>[], hints?: WithId<Technology>[]): Promise<WithId<MarshalledTechnology>[]>;
	public async marshal(
		techOrTechs: WithId<Technology> | WithId<Technology>[],
		hints?: WithId<Technology>[]
	): Promise<WithId<MarshalledTechnology> | WithId<MarshalledTechnology>[]> {
		if (Array.isArray(techOrTechs)) {
			const techs = techOrTechs;

			return Promise.all(techs.map((tech) => this.marshal(tech, hints)));
		} else {
			const tech = techOrTechs;

			try {
				const dependencies = await this.getPrerequisites(tech, hints);
				const dependents = await this.getDependents(tech, hints);
				// TODO: add buildings/districts/improvements/units/wonders unlocked when added

				return { ...tech, dependencies, dependents };
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

	public async getPrerequisites(tech: WithId<Technology>, hints?: WithId<Technology>[]): Promise<DLCRecord<WithId<Technology>[]>> {
		const prerequisites = {
			base: await Promise.all(
				tech.dependencies.base.map((id) => hints?.find((tech) => tech._id.toHexString() === id) || this.getById(ObjectId.createFromHexString(id)))
			),
			rf: await Promise.all(
				tech.dependencies.rf.map((id) => hints?.find((tech) => tech._id.toHexString() === id) || this.getById(ObjectId.createFromHexString(id)))
			),
			gs: await Promise.all(
				tech.dependencies.gs.map((id) => hints?.find((tech) => tech._id.toHexString() === id) || this.getById(ObjectId.createFromHexString(id)))
			)
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

	public async getDependents(tech: WithId<Technology>, hints?: WithId<Technology>[]): Promise<DLCRecord<WithId<Technology>[]>> {
		const base =
			hints?.filter((t) => t.dependencies.base.includes(tech._id.toHexString())) ||
			(await this._db.technologies.find({ 'dependencies.base': tech._id.toHexString() }).toArray());
		const rf =
			hints?.filter((t) => t.dependencies.base.includes(tech._id.toHexString())) ||
			(await this._db.technologies.find({ 'dependencies.rf': tech._id.toHexString() }).toArray());
		const gs =
			hints?.filter((t) => t.dependencies.base.includes(tech._id.toHexString())) ||
			(await this._db.technologies.find({ 'dependencies.gs': tech._id.toHexString() }).toArray());

		return {
			base,
			rf,
			gs
		};
	}
}

