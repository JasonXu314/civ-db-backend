import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ObjectId, WithId } from 'mongodb';
import { DBService } from 'src/db/db.service';
import { DLCRecord, DLC_STRINGS, MarshallingError, PrerequisiteError } from 'src/utils/common';
import { DeepPartial, deepMerge } from 'src/utils/utils';
import { Civic, MarshalledCivic } from './civic.model';

@Injectable()
export class CivicsService {
	private _logger: ConsoleLogger = new ConsoleLogger('Technologies Service');

	constructor(private _db: DBService) {}

	public async get(): Promise<WithId<Civic>[]> {
		return this._db.civics.find().toArray();
	}

	public async getById(_id: ObjectId): Promise<WithId<Civic> | null> {
		return this._db.civics.findOne({ _id });
	}

	public async search(query: string): Promise<WithId<Civic>[]> {
		return this._db.civics.find({ $text: { $search: query } }, { sort: { score: { $meta: 'textScore' } } }).toArray();
	}

	public async create(tech: Civic): Promise<ObjectId> {
		return (await this._db.civics.insertOne(tech)).insertedId;
	}

	public async update(_id: ObjectId, data: DeepPartial<Civic>): Promise<WithId<Civic> | null> {
		const existingData = await this.getById(_id);

		if (!existingData) {
			return null;
		}

		return (await this._db.civics.findOneAndUpdate({ _id }, { $set: deepMerge(existingData, data) })).value;
	}

	public async marshal(civic: WithId<Civic>): Promise<WithId<MarshalledCivic>>;
	public async marshal(civics: WithId<Civic>[]): Promise<WithId<MarshalledCivic>[]>;
	public async marshal(civicOrCivics: WithId<Civic> | WithId<Civic>[]): Promise<WithId<MarshalledCivic> | WithId<MarshalledCivic>[]> {
		if (Array.isArray(civicOrCivics)) {
			const civics = civicOrCivics;

			return Promise.all(civics.map((tech) => this.marshal(tech)));
		} else {
			const civic = civicOrCivics;

			try {
				const prerequisites = await this.getPrerequisites(civic);
				// TODO: add buildings/districts/improvements/units/wonders unlocked when added

				return { ...civic, prerequisites };
			} catch (err: unknown) {
				if (err instanceof PrerequisiteError || err instanceof Error) {
					throw new MarshallingError(err);
				} else {
					this._logger.log(`Encountered error when marshalling civic ${civic._id}`, err);
					throw new MarshallingError('Unknown Error');
				}
			}
		}
	}

	public async getPrerequisites(civic: WithId<Civic>): Promise<DLCRecord<WithId<Civic>[]>> {
		const prerequisites = {
			base: await Promise.all(civic.dependencies.base.map((id) => this.getById(id))),
			rf: await Promise.all(civic.dependencies.rf.map((id) => this.getById(id))),
			gs: await Promise.all(civic.dependencies.gs.map((id) => this.getById(id)))
		};

		for (const dlc of DLC_STRINGS) {
			if (prerequisites[dlc].some((tech) => tech === null)) {
				throw new PrerequisiteError(
					dlc,
					prerequisites[dlc].reduce<ObjectId[]>((missing, prereq, i) => (prereq === null ? [...missing, civic.dependencies[i]] : missing), [])
				);
			}
		}

		return prerequisites as DLCRecord<WithId<Civic>[]>;
	}
}

