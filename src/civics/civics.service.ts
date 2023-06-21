import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ObjectId, WithId } from 'mongodb';
import { DBService } from 'src/db/db.service';
import { DLCRecord, DLC_STRINGS, MarshallingError, PrerequisiteError } from 'src/utils/common';
import { DeepPartial, deepMerge, matchQuery, normalizeName, reformatName } from 'src/utils/utils';
import { Civic, MarshalledCivic } from './civic.model';

@Injectable()
export class CivicsService {
	private _logger: ConsoleLogger = new ConsoleLogger('Civics Service');

	constructor(private _db: DBService) {}

	public async get(): Promise<WithId<Civic>[]> {
		return this._db.civics.find().toArray();
	}

	public async getById(_id: ObjectId): Promise<WithId<Civic> | null> {
		return this._db.civics.findOne({ _id });
	}

	public async getByName(name: string): Promise<WithId<Civic> | null> {
		this._logger.log(`Finding civic with name "${reformatName(normalizeName(name))}"`);
		return this._db.civics.findOne({ name: reformatName(normalizeName(name)) });
	}

	public async search(query: string): Promise<WithId<Civic>[]> {
		const civics = await this._db.civics.find().toArray();

		return civics.filter((civic) => matchQuery(civic, query, 'name', 'description'));
	}

	public async create(terrain: Civic): Promise<ObjectId> {
		return (await this._db.civics.insertOne(terrain)).insertedId;
	}

	public async update(_id: ObjectId, data: DeepPartial<Civic>): Promise<WithId<Civic> | null> {
		const existingData = await this.getById(_id);

		if (!existingData) {
			return null;
		}

		return (await this._db.civics.findOneAndUpdate({ _id }, { $set: deepMerge(existingData, data) })).value;
	}

	public async marshal(civic: WithId<Civic>, hints?: WithId<Civic>[]): Promise<WithId<MarshalledCivic>>;
	public async marshal(civics: WithId<Civic>[], hints?: WithId<Civic>[]): Promise<WithId<MarshalledCivic>[]>;
	public async marshal(
		civicOrCivics: WithId<Civic> | WithId<Civic>[],
		hints?: WithId<Civic>[]
	): Promise<WithId<MarshalledCivic> | WithId<MarshalledCivic>[]> {
		if (Array.isArray(civicOrCivics)) {
			const civics = civicOrCivics;

			return Promise.all(civics.map((tech) => this.marshal(tech, hints)));
		} else {
			const civic = civicOrCivics;

			try {
				const dependencies = await this.getDependencies(civic);
				const dependents = await this.getDependents(civic);
				// TODO: add buildings/districts/improvements/units/wonders unlocked when added

				return { ...civic, dependencies, dependents };
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

	public async getDependencies(civic: WithId<Civic>, hints?: WithId<Civic>[]): Promise<DLCRecord<WithId<Civic>[]>> {
		const dependencies = {
			base: await Promise.all(
				civic.dependencies.base.map((id) => hints?.find((civic) => civic._id.toHexString() === id) || this.getById(ObjectId.createFromHexString(id)))
			),
			rf: await Promise.all(
				civic.dependencies.rf.map((id) => hints?.find((civic) => civic._id.toHexString() === id) || this.getById(ObjectId.createFromHexString(id)))
			),
			gs: await Promise.all(
				civic.dependencies.gs.map((id) => hints?.find((civic) => civic._id.toHexString() === id) || this.getById(ObjectId.createFromHexString(id)))
			)
		};

		for (const dlc of DLC_STRINGS) {
			if (dependencies[dlc].some((tech) => tech === null)) {
				throw new PrerequisiteError(
					dlc,
					dependencies[dlc].reduce<ObjectId[]>((missing, prereq, i) => (prereq === null ? [...missing, civic.dependencies[i]] : missing), [])
				);
			}
		}

		return dependencies as DLCRecord<WithId<Civic>[]>;
	}

	public async getDependents(civic: WithId<Civic>, hints?: WithId<Civic>[]): Promise<DLCRecord<WithId<Civic>[]>> {
		const base =
			hints?.filter((t) => t.dependencies.base.includes(civic._id.toHexString())) ||
			(await this._db.civics.find({ 'dependencies.base': civic._id.toHexString() }).toArray());
		const rf =
			hints?.filter((t) => t.dependencies.base.includes(civic._id.toHexString())) ||
			(await this._db.civics.find({ 'dependencies.rf': civic._id.toHexString() }).toArray());
		const gs =
			hints?.filter((t) => t.dependencies.base.includes(civic._id.toHexString())) ||
			(await this._db.civics.find({ 'dependencies.gs': civic._id.toHexString() }).toArray());

		return {
			base,
			rf,
			gs
		};
	}
}

