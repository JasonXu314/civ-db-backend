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
import { CreateTerrainDTO, UpdateTerrainDTO } from './terrain.dto';
import { MarshalledTerrain, Terrain } from './terrain.model';
import { TerrainsService } from './terrains.service';

@Controller('/terrains')
export class TerrainsController {
	private _logger: ConsoleLogger;

	constructor(private readonly terrains: TerrainsService) {
		this._logger = new ConsoleLogger('Terrains Controller');
	}

	@Get()
	public async getMarshalledTerrains(@Query(IDPipe) { id, query }: IDWithSearchDTO): Promise<WithId<MarshalledTerrain>[] | WithId<MarshalledTerrain>> {
		if (id) {
			const terrain = await this.terrains.getById(id);

			if (!terrain) {
				throw new NotFoundException(`Terrain with id ${id} does not exist`);
			} else {
				try {
					return await this.terrains.marshal(terrain);
				} catch (err: unknown) {
					if (err instanceof MarshallingError) {
						throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
					} else {
						this._logger.log(`Unknown error when marshalling terrain ${id}`, err);
						throw new InternalServerErrorException('Unknown Error');
					}
				}
			}
		} else if (query) {
			const terrains = await this.terrains.search(query);

			try {
				return await this.terrains.marshal(terrains);
			} catch (err: unknown) {
				if (err instanceof MarshallingError) {
					throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
				} else {
					this._logger.log(`Unknown error when marshalling terrains filtered by search term ${query}`, err);
					throw new InternalServerErrorException('Unknown Error');
				}
			}
		}

		try {
			const terrains = await this.terrains.get();
			return await this.terrains.marshal(terrains, terrains);
		} catch (err: unknown) {
			if (err instanceof MarshallingError) {
				throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
			} else {
				this._logger.log('Unknown error when marshalling all terrains', err);
				throw new InternalServerErrorException('Unknown Error');
			}
		}
	}

	@Get('/data')
	public async getTerrains(@Query(IDPipe) { id }: IDDTO): Promise<WithId<Terrain>[] | WithId<Terrain>> {
		if (id) {
			const terrain = await this.terrains.getById(id);

			if (!terrain) {
				throw new NotFoundException(`Terrain with id ${id} does not exist`);
			} else {
				return terrain;
			}
		}

		return this.terrains.get();
	}

	@Get('/data/:id')
	public async getTerrainById(@Param(IDPipe) { id }: IDRequiredDTO): Promise<WithId<Terrain>> {
		const tech = await this.terrains.getById(id);

		if (!tech) {
			throw new NotFoundException(`Terrain with id ${id} does not exist`);
		} else {
			return tech;
		}
	}

	@Post('/data')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('icon'), FormDataInterceptor)
	public async createTerrain(@Body() terrain: CreateTerrainDTO, @UploadedFile() file: Express.Multer.File): Promise<WithId<Terrain>> {
		const fd = new FormData();
		fd.append('file', file.buffer, { contentType: file.mimetype, filename: file.originalname });

		const iconId = (await axios.post<string>(`${process.env.CDN_URL}`, fd)).data;

		const newId = await this.terrains.create({ ...terrain, icon: `${process.env.CDN_URL}/${iconId}` });
		const newTerrain = await this.terrains.getById(newId);

		if (!newTerrain) {
			throw new NotFoundException('Failed to insert new terrain');
		} else {
			return newTerrain;
		}
	}

	@Patch('/data/:id')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('icon'), FormDataInterceptor)
	public async updateTerrain(
		@Param(IDPipe) { id }: IDRequiredDTO,
		@Body() terrain: UpdateTerrainDTO,
		@UploadedFile() file: Express.Multer.File
	): Promise<WithId<Terrain>> {
		const updates: DeepPartial<Terrain> = { ...terrain };

		if (file) {
			const fd = new FormData();
			fd.append('file', file.buffer, { contentType: file.mimetype, filename: file.originalname });

			const iconId = (await axios.post<string>(`${process.env.CDN_URL}`, fd)).data;
			updates.icon = `${process.env.CDN_URL}/${iconId}`;
		}

		const updatedTerrain = await this.terrains.update(id, updates);

		if (!updatedTerrain) {
			throw new NotFoundException('Failed to insert new terrain');
		} else {
			return updatedTerrain;
		}
	}

	@Get('/:name')
	public async getMarshalledTerrainByName(@Param() { name }: NameSearchDTO): Promise<WithId<MarshalledTerrain>> {
		const terrain = await this.terrains.getByName(name);

		if (!terrain) {
			throw new NotFoundException(`Terrain with name ${name} does not exist`);
		} else {
			try {
				return await this.terrains.marshal(terrain);
			} catch (err: unknown) {
				if (err instanceof MarshallingError) {
					throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
				} else {
					this._logger.log(`Unknown error when marshalling terrain ${terrain._id}`, err);
					throw new InternalServerErrorException('Unknown Error');
				}
			}
		}
	}
}

