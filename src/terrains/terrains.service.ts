import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ObjectId, WithId } from 'mongodb';
import { DBService } from 'src/db/db.service';
import { MarshallingError, PrerequisiteError } from 'src/utils/common';
import { DeepPartial, deepMerge, matchQuery, normalizeName, reformatName } from 'src/utils/utils';
import { MarshalledTerrain, Terrain } from './terrain.model';

@Injectable()
export class TerrainsService {
	private _logger: ConsoleLogger = new ConsoleLogger('Terrains Service');

	constructor(private _db: DBService) {}

	public async get(): Promise<WithId<Terrain>[]> {
		return this._db.terrains.find().toArray();
	}

	public async getById(_id: ObjectId): Promise<WithId<Terrain> | null> {
		return this._db.terrains.findOne({ _id });
	}

	public async getByName(name: string): Promise<WithId<Terrain> | null> {
		this._logger.log(`Finding civic with name "${reformatName(normalizeName(name))}"`);
		return this._db.terrains.findOne({ name: reformatName(normalizeName(name)) });
	}

	public async search(query: string): Promise<WithId<Terrain>[]> {
		const terrains = await this._db.terrains.find().toArray();

		return terrains.filter((terrain) => matchQuery(terrain, query, 'name'));
	}

	public async create(terrain: Terrain): Promise<ObjectId> {
		return (await this._db.terrains.insertOne(terrain)).insertedId;
	}

	public async update(_id: ObjectId, data: DeepPartial<Terrain>): Promise<WithId<Terrain> | null> {
		const existingData = await this.getById(_id);

		if (!existingData) {
			return null;
		}

		return (await this._db.terrains.findOneAndUpdate({ _id }, { $set: deepMerge(existingData, data) })).value;
	}

	public async marshal(terrain: WithId<Terrain>, hints?: WithId<Terrain>[]): Promise<WithId<MarshalledTerrain>>;
	public async marshal(terrain: WithId<Terrain>[], hints?: WithId<Terrain>[]): Promise<WithId<MarshalledTerrain>[]>;
	public async marshal(
		terrainOrTerrains: WithId<Terrain> | WithId<Terrain>[],
		hints?: WithId<Terrain>[]
	): Promise<WithId<MarshalledTerrain> | WithId<MarshalledTerrain>[]> {
		if (Array.isArray(terrainOrTerrains)) {
			const terrains = terrainOrTerrains;

			return Promise.all(terrains.map((terrain) => this.marshal(terrain, hints)));
		} else {
			const terrain = terrainOrTerrains;

			try {
				// const dependencies = await this.getDependencies(civic);
				// const dependents = await this.getDependents(civic);
				// TODO: add buildings/districts/improvements/units/wonders unlocked when added

				return { ...terrain };
			} catch (err: unknown) {
				if (err instanceof PrerequisiteError || err instanceof Error) {
					throw new MarshallingError(err);
				} else {
					this._logger.log(`Encountered error when marshalling terrain ${terrain._id}`, err);
					throw new MarshallingError('Unknown Error');
				}
			}
		}
	}
}

