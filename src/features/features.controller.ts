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
import { CreateFeatureDTO, UpdateFeatureDTO } from './feature.dto';
import { Feature, MarshalledFeature } from './feature.model';
import { FeaturesService } from './features.service';

@Controller('/features')
export class FeaturesController {
	private _logger: ConsoleLogger;

	constructor(private readonly features: FeaturesService) {
		this._logger = new ConsoleLogger('Features Controller');
	}

	@Get()
	public async getMarshalledFeatures(@Query(IDPipe) { id, query }: IDWithSearchDTO): Promise<WithId<MarshalledFeature>[] | WithId<MarshalledFeature>> {
		if (id) {
			const features = await this.features.getById(id);

			if (!features) {
				throw new NotFoundException(`Feature with id ${id} does not exist`);
			} else {
				try {
					return await this.features.marshal(features);
				} catch (err: unknown) {
					if (err instanceof MarshallingError) {
						throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
					} else {
						this._logger.log(`Unknown error when marshalling features ${id}`, err);
						throw new InternalServerErrorException('Unknown Error');
					}
				}
			}
		} else if (query) {
			const features = await this.features.search(query);

			try {
				return await this.features.marshal(features);
			} catch (err: unknown) {
				if (err instanceof MarshallingError) {
					throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
				} else {
					this._logger.log(`Unknown error when marshalling features filtered by search term ${query}`, err);
					throw new InternalServerErrorException('Unknown Error');
				}
			}
		}

		try {
			const features = await this.features.get();
			return await this.features.marshal(features, features);
		} catch (err: unknown) {
			if (err instanceof MarshallingError) {
				throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
			} else {
				this._logger.log('Unknown error when marshalling all features', err);
				throw new InternalServerErrorException('Unknown Error');
			}
		}
	}

	@Get('/data')
	public async getFeatures(@Query(IDPipe) { id }: IDDTO): Promise<WithId<Feature>[] | WithId<Feature>> {
		if (id) {
			const feature = await this.features.getById(id);

			if (!feature) {
				throw new NotFoundException(`Feature with id ${id} does not exist`);
			} else {
				return feature;
			}
		}

		return this.features.get();
	}

	@Get('/data/:id')
	public async getFeatureById(@Param(IDPipe) { id }: IDRequiredDTO): Promise<WithId<Feature>> {
		const feature = await this.features.getById(id);

		if (!feature) {
			throw new NotFoundException(`Feature with id ${id} does not exist`);
		} else {
			return feature;
		}
	}

	@Post('/data')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('icon'), FormDataInterceptor)
	public async createFeature(@Body() feature: CreateFeatureDTO, @UploadedFile() file: Express.Multer.File): Promise<WithId<Feature>> {
		const fd = new FormData();
		fd.append('file', file.buffer, { contentType: file.mimetype, filename: file.originalname });

		const iconId = (await axios.post<string>(`${process.env.CDN_URL}`, fd)).data;

		const newId = await this.features.create({ ...feature, icon: `${process.env.CDN_URL}/${iconId}` });
		const newFeature = await this.features.getById(newId);

		if (!newFeature) {
			throw new NotFoundException('Failed to insert new feature');
		} else {
			return newFeature;
		}
	}

	@Patch('/data/:id')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('icon'), FormDataInterceptor)
	public async updateFeature(
		@Param(IDPipe) { id }: IDRequiredDTO,
		@Body() feature: UpdateFeatureDTO,
		@UploadedFile() file: Express.Multer.File
	): Promise<WithId<Feature>> {
		const updates: DeepPartial<Feature> = { ...feature };

		if (file) {
			const fd = new FormData();
			fd.append('file', file.buffer, { contentType: file.mimetype, filename: file.originalname });

			const iconId = (await axios.post<string>(`${process.env.CDN_URL}`, fd)).data;
			updates.icon = `${process.env.CDN_URL}/${iconId}`;
		}

		const updatedFeature = await this.features.update(id, updates);

		if (!updatedFeature) {
			throw new NotFoundException('Failed to insert new feature');
		} else {
			return updatedFeature;
		}
	}

	@Get('/:name')
	public async getMarshalledFeatureByName(@Param() { name }: NameSearchDTO): Promise<WithId<MarshalledFeature>> {
		const feature = await this.features.getByName(name);

		if (!feature) {
			throw new NotFoundException(`Feature with name ${name} does not exist`);
		} else {
			try {
				return await this.features.marshal(feature);
			} catch (err: unknown) {
				if (err instanceof MarshallingError) {
					throw new InternalServerErrorException(typeof err.cause === 'string' ? err.cause : err.cause.message);
				} else {
					this._logger.log(`Unknown error when marshalling feature ${feature._id}`, err);
					throw new InternalServerErrorException('Unknown Error');
				}
			}
		}
	}
}

