import { Injectable } from '@nestjs/common';
import { ObjectId, WithId } from 'mongodb';
import { DBService } from 'src/db/db.service';
import { DeepPartial, deepMerge } from 'src/utils/utils';
import { Unit } from './unit.model';

@Injectable()
export class UnitsService {
	constructor(private _db: DBService) {}

	public async get(): Promise<WithId<Unit>[]> {
		return this._db.units.find().toArray();
	}

	public async getById(_id: ObjectId): Promise<WithId<Unit> | null> {
		return this._db.units.findOne({ _id });
	}

	public async create(unit: Unit): Promise<ObjectId> {
		return (await this._db.units.insertOne(unit)).insertedId;
	}

	public async update(_id: ObjectId, data: DeepPartial<Unit>): Promise<WithId<Unit> | null> {
		const existingData = await this.getById(_id);

		if (!existingData) {
			return null;
		}

		return (await this._db.units.findOneAndUpdate({ _id }, { $set: deepMerge(existingData, data) })).value;
	}
}

