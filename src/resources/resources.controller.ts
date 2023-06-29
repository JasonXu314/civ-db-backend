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
import { CreateResourceDTO, UpdateResourceDTO } from './resource.dto';
import { MarshalledResource, Resource } from './resource.model';
import { ResourcesService } from './resources.service';

@Controller('/resources')
export class ResourcesController {
	private _logger: ConsoleLogger;

	constructor(private readonly resources: ResourcesService) {
		this._logger = new ConsoleLogger('Resources Controller');
	}

	@Get()
	public async getMarshalledResources(@Query(IDPipe) { id, query }: IDWithSearchDTO): Promise<WithId<MarshalledResource>[] | WithId<MarshalledResource>> {
		if (id) {
			const resources = await this.resources.getById(id);

			if (!resources) {
				throw new NotFoundException(`Resource with id ${id} does not exist`);
			} else {
				try {
					return await this.resources.marshal(resources);
				} catch (err: unknown) {
					if (err instanceof MarshallingError) {
						throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
					} else {
						this._logger.log(`Unknown error when marshalling resources ${id}`, err);
						throw new InternalServerErrorException('Unknown Error');
					}
				}
			}
		} else if (query) {
			const resource = await this.resources.search(query);

			try {
				return await this.resources.marshal(resource);
			} catch (err: unknown) {
				if (err instanceof MarshallingError) {
					throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
				} else {
					this._logger.log(`Unknown error when marshalling resources filtered by search term ${query}`, err);
					throw new InternalServerErrorException('Unknown Error');
				}
			}
		}

		try {
			const resources = await this.resources.get();
			return await this.resources.marshal(resources, resources);
		} catch (err: unknown) {
			if (err instanceof MarshallingError) {
				throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
			} else {
				this._logger.log('Unknown error when marshalling all resources', err);
				throw new InternalServerErrorException('Unknown Error');
			}
		}
	}

	@Get('/data')
	public async getResources(@Query(IDPipe) { id }: IDDTO): Promise<WithId<Resource>[] | WithId<Resource>> {
		if (id) {
			const resource = await this.resources.getById(id);

			if (!resource) {
				throw new NotFoundException(`Resource with id ${id} does not exist`);
			} else {
				return resource;
			}
		}

		return this.resources.get();
	}

	@Get('/data/:id')
	public async getResourceById(@Param(IDPipe) { id }: IDRequiredDTO): Promise<WithId<Resource>> {
		const resource = await this.resources.getById(id);

		if (!resource) {
			throw new NotFoundException(`Resource with id ${id} does not exist`);
		} else {
			return resource;
		}
	}

	@Post('/data')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('icon'), FormDataInterceptor)
	public async createResource(@Body() resource: CreateResourceDTO, @UploadedFile() file: Express.Multer.File): Promise<WithId<Resource>> {
		const fd = new FormData();
		fd.append('file', file.buffer, { contentType: file.mimetype, filename: file.originalname });

		const iconId = (await axios.post<string>(`${process.env.CDN_URL}`, fd)).data;

		const newId = await this.resources.create({ ...resource, icon: `${process.env.CDN_URL}/${iconId}` });
		const newResource = await this.resources.getById(newId);

		if (!newResource) {
			throw new NotFoundException('Failed to insert new resource');
		} else {
			return newResource;
		}
	}

	@Patch('/data/:id')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('icon'), FormDataInterceptor)
	public async updateResource(
		@Param(IDPipe) { id }: IDRequiredDTO,
		@Body() resource: UpdateResourceDTO,
		@UploadedFile() file: Express.Multer.File
	): Promise<WithId<Resource>> {
		const updates: DeepPartial<Resource> = { ...resource };

		if (file) {
			const fd = new FormData();
			fd.append('file', file.buffer, { contentType: file.mimetype, filename: file.originalname });

			const iconId = (await axios.post<string>(`${process.env.CDN_URL}`, fd)).data;
			updates.icon = `${process.env.CDN_URL}/${iconId}`;
		}

		const updatedResource = await this.resources.update(id, updates);

		if (!updatedResource) {
			throw new NotFoundException('Failed to insert new resource');
		} else {
			return updatedResource;
		}
	}

	@Get('/:name')
	public async getMarshalledResourceByName(@Param() { name }: NameSearchDTO): Promise<WithId<MarshalledResource>> {
		const resource = await this.resources.getByName(name);

		if (!resource) {
			throw new NotFoundException(`Resource with name ${name} does not exist`);
		} else {
			try {
				return await this.resources.marshal(resource);
			} catch (err: unknown) {
				if (err instanceof MarshallingError) {
					throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
				} else {
					this._logger.log(`Unknown error when marshalling resource ${resource._id}`, err);
					throw new InternalServerErrorException('Unknown Error');
				}
			}
		}
	}
}

