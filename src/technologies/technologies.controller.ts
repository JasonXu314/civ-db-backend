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
import { TechnologiesService } from './technologies.service';
import { CreateTechnologyDTO, UpdateTechnologyDTO } from './technology.dto';
import { MarshalledTechnology, Technology } from './technology.model';

@Controller('/technologies')
export class TechnologiesController {
	private _logger: ConsoleLogger;

	constructor(private readonly technologies: TechnologiesService) {
		this._logger = new ConsoleLogger('Technologies Controller');
	}

	@Get()
	public async getMarshalledTechnologies(
		@Query(IDPipe) { id, query }: IDWithSearchDTO
	): Promise<WithId<MarshalledTechnology>[] | WithId<MarshalledTechnology>> {
		if (id) {
			const tech = await this.technologies.getById(id);

			if (!tech) {
				throw new NotFoundException(`Technology with id ${id} does not exist`);
			} else {
				try {
					return await this.technologies.marshal(tech);
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
			const tech = await this.technologies.search(query);

			if (!tech) {
				throw new NotFoundException(`Technology with id ${id} does not exist`);
			} else {
				try {
					return await this.technologies.marshal(tech);
				} catch (err: unknown) {
					if (err instanceof MarshallingError) {
						throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
					} else {
						this._logger.log(`Unknown error when marshalling technologies filtered by search term ${query}`, err);
						throw new InternalServerErrorException('Unknown Error');
					}
				}
			}
		}

		try {
			const techs = await this.technologies.get();
			return await this.technologies.marshal(techs, techs);
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
	public async getTechnologies(@Query(IDPipe) { id }: IDDTO): Promise<WithId<Technology>[] | WithId<Technology>> {
		if (id) {
			const tech = await this.technologies.getById(id);

			if (!tech) {
				throw new NotFoundException(`Technology with id ${id} does not exist`);
			} else {
				return tech;
			}
		}

		return this.technologies.get();
	}

	@Get('/data/:id')
	public async getTechnologyById(@Param(IDPipe) { id }: IDRequiredDTO): Promise<WithId<Technology>> {
		const tech = await this.technologies.getById(id);

		if (!tech) {
			throw new NotFoundException(`Technology with id ${id} does not exist`);
		} else {
			return tech;
		}
	}

	@Post('/data')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('icon'), FormDataInterceptor)
	public async createTechnology(
		@Body(new IDPipe('replaces', 'unlockedBy', 'obsoletedBy', 'upgradesFrom', 'upgradesTo')) tech: CreateTechnologyDTO,
		@UploadedFile() file: Express.Multer.File
	): Promise<WithId<Technology>> {
		const fd = new FormData();
		fd.append('file', file.buffer, { contentType: file.mimetype, filename: file.originalname });

		const iconId = (await axios.post<string>(`${process.env.CDN_URL}`, fd)).data;

		const newId = await this.technologies.create({ ...tech, icon: `${process.env.CDN_URL}/${iconId}` });
		const newTech = await this.technologies.getById(newId);

		if (!newTech) {
			throw new NotFoundException('Failed to insert new technology');
		} else {
			return newTech;
		}
	}

	@Patch('/data/:id')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('icon'), FormDataInterceptor)
	public async updateTechnology(
		@Param(IDPipe) { id }: IDRequiredDTO,
		@Body(new IDPipe('replaces', 'unlockedBy', 'obsoletedBy', 'upgradesFrom', 'upgradesTo')) tech: UpdateTechnologyDTO,
		@UploadedFile() file: Express.Multer.File
	): Promise<WithId<Technology>> {
		const updates: DeepPartial<Technology> = { ...tech };

		if (file) {
			const fd = new FormData();
			fd.append('file', file.buffer, { contentType: file.mimetype, filename: file.originalname });

			const iconId = (await axios.post<string>(`${process.env.CDN_URL}`, fd)).data;
			updates.icon = `${process.env.CDN_URL}/${iconId}`;
		}

		const updatedTech = await this.technologies.update(id, updates);

		if (!updatedTech) {
			throw new NotFoundException('Failed to insert new technology');
		} else {
			return updatedTech;
		}
	}

	@Get('/:name')
	public async getMarshalledCivicByName(@Param() { name }: NameSearchDTO): Promise<WithId<MarshalledTechnology>> {
		const tech = await this.technologies.getByName(name);

		if (!tech) {
			throw new NotFoundException(`Technology with name ${name} does not exist`);
		} else {
			try {
				return await this.technologies.marshal(tech);
			} catch (err: unknown) {
				if (err instanceof MarshallingError) {
					throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
				} else {
					this._logger.log(`Unknown error when marshalling technology ${tech._id}`, err);
					throw new InternalServerErrorException('Unknown Error');
				}
			}
		}
	}
}

