import { ConsoleLogger, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import { Civilization } from 'src/civilizations/civilization.model';
import { Technology } from 'src/technologies/technologies.model';
import { Unit } from 'src/units/units.model';

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

	private _getDB(): string {
		switch (process.env.STAGE) {
			case 'test':
				return 'staging';
			case 'local':
			case 'live':
				return 'main';
			default:
				this._logger.log(`Unrecognized staging environment ${process.env.STAGE}`);
				throw new InternalServerErrorException(`Unrecognized staging environment ${process.env.STAGE}`);
		}
	}
}

