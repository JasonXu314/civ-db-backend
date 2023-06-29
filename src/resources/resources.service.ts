import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ObjectId, WithId } from 'mongodb';
import { DBService } from 'src/db/db.service';
import { Feature } from 'src/features/feature.model';
import { FeaturesService } from 'src/features/features.service';
import { TechnologiesService } from 'src/technologies/technologies.service';
import { Terrain } from 'src/terrains/terrain.model';
import { TerrainsService } from 'src/terrains/terrains.service';
import { MarshallingError, PrerequisiteError } from 'src/utils/common';
import { DeepPartial, deepMerge, matchQuery, normalizeName, reformatName } from 'src/utils/utils';
import { MarshalledResource, Resource } from './resource.model';

@Injectable()
export class ResourcesService {
	private _logger: ConsoleLogger = new ConsoleLogger('Resources Service');

	constructor(private _db: DBService, private technologies: TechnologiesService, private terrains: TerrainsService, private features: FeaturesService) {}

	public async get(): Promise<WithId<Resource>[]> {
		return this._db.resources.find().toArray();
	}

	public async getById(_id: ObjectId): Promise<WithId<Resource> | null> {
		return this._db.resources.findOne({ _id });
	}

	public async getByName(name: string): Promise<WithId<Resource> | null> {
		return this._db.resources.findOne({ name: reformatName(normalizeName(name)) });
	}

	public async search(query: string): Promise<WithId<Resource>[]> {
		const resources = await this._db.resources.find().toArray();

		return resources.filter((resource) => matchQuery(resource, query, 'name', 'description'));
	}

	public async create(resource: Resource): Promise<ObjectId> {
		return (await this._db.resources.insertOne(resource)).insertedId;
	}

	public async update(_id: ObjectId, data: DeepPartial<Resource>): Promise<WithId<Resource> | null> {
		const existingData = await this.getById(_id);

		if (!existingData) {
			return null;
		}

		return (await this._db.resources.findOneAndUpdate({ _id }, { $set: deepMerge(existingData, data) })).value;
	}

	public async marshal(resource: WithId<Resource>, hints?: WithId<Resource>[]): Promise<WithId<MarshalledResource>>;
	public async marshal(resources: WithId<Resource>[], hints?: WithId<Resource>[]): Promise<WithId<MarshalledResource>[]>;
	public async marshal(
		resourceOrResources: WithId<Resource> | WithId<Resource>[],
		hints?: WithId<Resource>[]
	): Promise<WithId<MarshalledResource> | WithId<MarshalledResource>[]> {
		if (Array.isArray(resourceOrResources)) {
			const resources = resourceOrResources;

			return Promise.all(resources.map((resource) => this.marshal(resource, hints)));
		} else {
			const resource = resourceOrResources;

			try {
				const validTerrain = await Promise.all(resource.validTerrain.map((id) => this.terrains.getById(ObjectId.createFromHexString(id))));
				const validFeatures = await Promise.all(resource.validFeatures.map((id) => this.features.getById(ObjectId.createFromHexString(id))));
				const harvestTech = await this.technologies.getById(ObjectId.createFromHexString(resource.harvestTech));
				// TODO: add buildings/districts/improvements/units/wonders unlocked when added

				if (validTerrain.some((terrain) => terrain === null)) {
					throw new Error('Unable to resolve spawning terrain.');
				}
				if (validFeatures.some((feature) => feature === null)) {
					throw new Error('Unable to resolve spawning feature.');
				}
				if (harvestTech === null) {
					throw new Error('Unable to resolve harvest technology.');
				}

				return { ...resource, validTerrain: validTerrain as WithId<Terrain>[], validFeatures: validFeatures as WithId<Feature>[], harvestTech };
			} catch (err: unknown) {
				if (err instanceof PrerequisiteError || err instanceof Error) {
					throw new MarshallingError(err);
				} else {
					this._logger.log(`Encountered error when marshalling resource ${resource._id}`, err);
					throw new MarshallingError('Unknown Error');
				}
			}
		}
	}
}

