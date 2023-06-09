import { ConsoleLogger, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import { Civic } from 'src/civics/civic.model';
import { Civilization } from 'src/civilizations/civilization.model';
import { Feature } from 'src/features/feature.model';
import { Resource } from 'src/resources/resource.model';
import { Technology } from 'src/technologies/technology.model';
import { Terrain } from 'src/terrains/terrain.model';
import { Unit } from 'src/units/unit.model';

@Injectable()
export class DBService {
	private readonly _logger: ConsoleLogger;
	private _db: MongoClient | null = null;
	private _connected = false;

	constructor() {
		this._logger = new ConsoleLogger('DB');

		MongoClient.connect(process.env.MONGODB_URL!)
			.then((client) => {
				this._logger.log('Connected');
				this._db = client;
				this._connected = true;
			})
			.catch((err) => {
				this._logger.error('Error initializing DB', err);
			});
	}

	public get client(): MongoClient {
		if (!this._connected) {
			throw new InternalServerErrorException('DB not connected');
		}

		return this._db!;
	}

	public get civilizations(): Collection<Civilization> {
		return this.client.db(this._getDB()).collection('civilizations');
	}

	public get leaders(): Collection {
		return this.client.db(this._getDB()).collection('leaders');
	}

	public get units(): Collection<Unit> {
		return this.client.db(this._getDB()).collection('units');
	}

	public get technologies(): Collection<Technology> {
		return this.client.db(this._getDB()).collection('technologies');
	}

	public get civics(): Collection<Civic> {
		return this.client.db(this._getDB()).collection('civics');
	}

	public get terrains(): Collection<Terrain> {
		return this.client.db(this._getDB()).collection('terrains');
	}

	public get features(): Collection<Feature> {
		return this.client.db(this._getDB()).collection('features');
	}

	public get resources(): Collection<Resource> {
		return this.client.db(this._getDB()).collection('resources');
	}

	private _getDB(): string {
		switch (process.env.STAGE) {
			case 'test':
			case 'local':
				return 'staging';
			case 'live':
				return 'main';
			default:
				this._logger.log(`Unrecognized staging environment ${process.env.STAGE}`);
				throw new InternalServerErrorException(`Unrecognized staging environment ${process.env.STAGE}`);
		}
	}
}

