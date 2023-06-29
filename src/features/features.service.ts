import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ObjectId, WithId } from 'mongodb';
import { DBService } from 'src/db/db.service';
import { MarshallingError, PrerequisiteError } from 'src/utils/common';
import { DeepPartial, deepMerge, matchQuery, normalizeName, reformatName } from 'src/utils/utils';
import { Feature, MarshalledFeature } from './feature.model';

@Injectable()
export class FeaturesService {
	private _logger: ConsoleLogger = new ConsoleLogger('Features Service');

	constructor(private _db: DBService) {}

	public async get(): Promise<WithId<Feature>[]> {
		return this._db.features.find().toArray();
	}

	public async getById(_id: ObjectId): Promise<WithId<Feature> | null> {
		return this._db.features.findOne({ _id });
	}

	public async getByName(name: string): Promise<WithId<Feature> | null> {
		this._logger.log(`Finding feature with name "${reformatName(normalizeName(name))}"`);
		return this._db.features.findOne({ name: reformatName(normalizeName(name)) });
	}

	public async search(query: string): Promise<WithId<Feature>[]> {
		const features = await this._db.features.find().toArray();

		return features.filter((feature) => matchQuery(feature, query, 'name'));
	}

	public async create(feature: Feature): Promise<ObjectId> {
		return (await this._db.features.insertOne(feature)).insertedId;
	}

	public async update(_id: ObjectId, data: DeepPartial<Feature>): Promise<WithId<Feature> | null> {
		const existingData = await this.getById(_id);

		if (!existingData) {
			return null;
		}

		return (await this._db.features.findOneAndUpdate({ _id }, { $set: deepMerge(existingData, data) })).value;
	}

	public async marshal(feature: WithId<Feature>, hints?: WithId<Feature>[]): Promise<WithId<MarshalledFeature>>;
	public async marshal(features: WithId<Feature>[], hints?: WithId<Feature>[]): Promise<WithId<MarshalledFeature>[]>;
	public async marshal(
		featureOrFeatures: WithId<Feature> | WithId<Feature>[],
		hints?: WithId<Feature>[]
	): Promise<WithId<MarshalledFeature> | WithId<MarshalledFeature>[]> {
		if (Array.isArray(featureOrFeatures)) {
			const features = featureOrFeatures;

			return Promise.all(features.map((feature) => this.marshal(feature, hints)));
		} else {
			const feature = featureOrFeatures;

			try {
				// const dependencies = await this.getDependencies(civic);
				// const dependents = await this.getDependents(civic);
				// TODO: add buildings/districts/improvements/units/wonders unlocked when added

				return { ...feature };
			} catch (err: unknown) {
				if (err instanceof PrerequisiteError || err instanceof Error) {
					throw new MarshallingError(err);
				} else {
					this._logger.log(`Encountered error when marshalling feature ${feature._id}`, err);
					throw new MarshallingError('Unknown Error');
				}
			}
		}
	}
}

