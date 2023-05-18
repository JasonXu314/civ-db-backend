import { ConsoleLogger, Controller, Get } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import { Civilization } from './civilization.model';

@Controller('/civilizations')
export class CivsController {
	private _logger: ConsoleLogger;

	constructor(private _db: DBService) {
		this._logger = new ConsoleLogger();
	}

	@Get()
	public async getCivs(): Promise<Civilization[] | Civilization> {
		return this._db.civilizations.find().toArray();
	}
}

