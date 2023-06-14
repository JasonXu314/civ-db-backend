import {
	Body,
	ConsoleLogger,
	Controller,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import * as FormData from 'form-data';
import { WithId } from 'mongodb';
import { MarshallingError } from 'src/utils/common';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { FormDataInterceptor } from 'src/utils/interceptors/FormData.interceptor';
import { IDPipe } from 'src/utils/pipes/id.pipe';
import { DeepPartial, IDDTO, IDRequiredDTO, IDWithSearchDTO, NameSearchDTO } from 'src/utils/utils';
import { CreateCivicDTO, UpdateCivicDTO } from './civic.dto';
import { Civic, MarshalledCivic } from './civic.model';
import { CivicsService } from './civics.service';

@Controller('/civics')
export class CivicsController {
	private _logger: ConsoleLogger;

	constructor(private readonly civics: CivicsService) {
		this._logger = new ConsoleLogger('Civics Controller');
	}

	@Get()
	public async getMarshalledCivics(@Query(IDPipe) { id, query }: IDWithSearchDTO): Promise<WithId<MarshalledCivic>[] | WithId<MarshalledCivic>> {
		if (id) {
			const civic = await this.civics.getById(id);

			if (!civic) {
				throw new NotFoundException(`Technology with id ${id} does not exist`);
			} else {
				try {
					return await this.civics.marshal(civic);
				} catch (err: unknown) {
					if (err instanceof MarshallingError) {
						throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
					} else {
						this._logger.log(`Unknown error when marshalling technology ${id}`, err);
						throw new InternalServerErrorException('Unknown Error');
					}
				}
			}
		} else if (query) {
			const civics = await this.civics.search(query);

			try {
				return await this.civics.marshal(civics);
			} catch (err: unknown) {
				if (err instanceof MarshallingError) {
					throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
				} else {
					this._logger.log(`Unknown error when marshalling technologies filtered by search term ${query}`, err);
					throw new InternalServerErrorException('Unknown Error');
				}
			}
		}

		try {
			return await this.civics.marshal(await this.civics.get());
		} catch (err: unknown) {
			if (err instanceof MarshallingError) {
				throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
			} else {
				this._logger.log('Unknown error when marshalling all technologies', err);
				throw new InternalServerErrorException('Unknown Error');
			}
		}
	}

	@Get('/data')
	public async getCivics(@Query(IDPipe) { id }: IDDTO): Promise<WithId<Civic>[] | WithId<Civic>> {
		if (id) {
			const tech = await this.civics.getById(id);

			if (!tech) {
				throw new NotFoundException(`Civic with id ${id} does not exist`);
			} else {
				return tech;
			}
		}

		return this.civics.get();
	}

	@Get('/data/:id')
	public async getCivicById(@Param(IDPipe) { id }: IDRequiredDTO): Promise<WithId<Civic>> {
		const tech = await this.civics.getById(id);

		if (!tech) {
			throw new NotFoundException(`Civic with id ${id} does not exist`);
		} else {
			return tech;
		}
	}

	@Post('/data')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('icon'), FormDataInterceptor)
	public async createCivic(
		@Body(new IDPipe('replaces', 'unlockedBy', 'obsoletedBy', 'upgradesFrom', 'upgradesTo')) civic: CreateCivicDTO,
		@UploadedFile() file: Express.Multer.File
	): Promise<WithId<Civic>> {
		const fd = new FormData();
		fd.append('file', file.buffer, { contentType: file.mimetype, filename: file.originalname });

		const iconId = (await axios.post<string>(`${process.env.CDN_URL}`, fd)).data;

		const newId = await this.civics.create({ ...civic, icon: `${process.env.CDN_URL}/${iconId}` });
		const newCivic = await this.civics.getById(newId);

		if (!newCivic) {
			throw new NotFoundException('Failed to insert new technology');
		} else {
			return newCivic;
		}
	}

	@Patch('/data/:id')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('icon'), FormDataInterceptor)
	public async updateCivic(
		@Param(IDPipe) { id }: IDRequiredDTO,
		@Body(new IDPipe('replaces', 'unlockedBy', 'obsoletedBy', 'upgradesFrom', 'upgradesTo')) civic: UpdateCivicDTO,
		@UploadedFile() file: Express.Multer.File
	): Promise<WithId<Civic>> {
		const updates: DeepPartial<Civic> = { ...civic };

		if (file) {
			const fd = new FormData();
			fd.append('file', file.buffer, { contentType: file.mimetype, filename: file.originalname });

			const iconId = (await axios.post<string>(`${process.env.CDN_URL}`, fd)).data;
			updates.icon = `${process.env.CDN_URL}/${iconId}`;
		}

		const updatedTech = await this.civics.update(id, updates);

		if (!updatedTech) {
			throw new NotFoundException('Failed to insert new technology');
		} else {
			return updatedTech;
		}
	}

	@Get('/:name')
	public async getMarshalledCivicByName(@Param() { name }: NameSearchDTO): Promise<WithId<MarshalledCivic>> {
		const civic = await this.civics.getByName(name);

		if (!civic) {
			throw new NotFoundException(`Technology with name ${name} does not exist`);
		} else {
			try {
				return await this.civics.marshal(civic);
			} catch (err: unknown) {
				if (err instanceof MarshallingError) {
					throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
				} else {
					this._logger.log(`Unknown error when marshalling technology ${civic._id}`, err);
					throw new InternalServerErrorException('Unknown Error');
				}
			}
		}
	}
}

