import { Body, ConsoleLogger, Controller, Get, NotFoundException, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import * as FormData from 'form-data';
import { WithId } from 'mongodb';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { FormDataInterceptor } from 'src/utils/interceptors/FormData.interceptor';
import { IDPipe } from 'src/utils/pipes/id.pipe';
import { DeepPartial, IDDTO, IDRequiredDTO } from 'src/utils/utils';
import { CreateUnitDTO, UpdateUnitDTO } from './unit.dto';
import { Unit } from './unit.model';
import { UnitsService } from './units.service';

@Controller('/units')
export class UnitsController {
	private _logger: ConsoleLogger;

	constructor(private readonly units: UnitsService) {
		this._logger = new ConsoleLogger();
	}

	@Get('/data')
	public async getUnits(@Query(IDPipe) { id }: IDDTO): Promise<WithId<Unit>[] | WithId<Unit>> {
		if (id) {
			const unit = await this.units.getById(id);

			if (!unit) {
				throw new NotFoundException(`Unit with id ${id} does not exist`);
			} else {
				return unit;
			}
		}

		return this.units.get();
	}

	@Get('/data/:id')
	public async getUnitById(@Param(IDPipe) { id }: IDRequiredDTO): Promise<WithId<Unit>> {
		const unit = await this.units.getById(id);

		if (!unit) {
			throw new NotFoundException(`Unit with id ${id} does not exist`);
		} else {
			return unit;
		}
	}

	@Post('/data')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('icon'), FormDataInterceptor)
	public async createUnit(
		@Body(new IDPipe('replaces', 'unlockedBy', 'obsoletedBy', 'upgradesFrom', 'upgradesTo')) unit: CreateUnitDTO,
		@UploadedFile() file: Express.Multer.File
	): Promise<WithId<Unit>> {
		const fd = new FormData();
		fd.append('file', file.buffer, { contentType: file.mimetype, filename: file.originalname });

		const iconId = (await axios.post<string>(`${process.env.CDN_URL}`, fd)).data;

		const newId = await this.units.create({ ...unit, icon: `${process.env.CDN_URL}/${iconId}` });
		const newUnit = await this.units.getById(newId);

		if (!newUnit) {
			throw new NotFoundException('Failed to insert new unit');
		} else {
			return newUnit;
		}
	}

	@Patch('/data/:id')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('icon'), FormDataInterceptor)
	public async updateUnit(
		@Param(IDPipe) { id }: IDRequiredDTO,
		@Body(new IDPipe('replaces', 'unlockedBy', 'obsoletedBy', 'upgradesFrom', 'upgradesTo')) unit: UpdateUnitDTO,
		@UploadedFile() file: Express.Multer.File
	): Promise<WithId<Unit>> {
		const updates: DeepPartial<Unit> = { ...unit };

		if (file) {
			const fd = new FormData();
			fd.append('file', file.buffer, { contentType: file.mimetype, filename: file.originalname });

			const iconId = (await axios.post<string>(`${process.env.CDN_URL}`, fd)).data;
			updates.icon = `${process.env.CDN_URL}/${iconId}`;
		}

		const updatedUnit = await this.units.update(id, updates);

		if (!updatedUnit) {
			throw new NotFoundException('Failed to insert new unit');
		} else {
			return updatedUnit;
		}
	}
}

