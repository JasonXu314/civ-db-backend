import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DLCString, DLC_STRINGS, DescDLCRecord, ERAS, Era, MultiDescDLCRecord, MultiReferenceDLCRecord, StatDLCRecord } from 'src/utils/common';
import { forceInit } from 'src/utils/utils';

export class CreateCivicDTO {
	@IsString()
	@IsNotEmpty()
	name: string = forceInit();

	@IsIn(ERAS)
	era: Era = forceInit();

	@Type(() => StatDLCRecord)
	cost: StatDLCRecord = forceInit();

	@Type(() => MultiReferenceDLCRecord)
	dependencies: MultiReferenceDLCRecord = forceInit();

	@Type(() => StatDLCRecord)
	envoys: StatDLCRecord = forceInit();

	@Type(() => StatDLCRecord)
	governorTitles: StatDLCRecord = forceInit();

	@IsString()
	description: string = forceInit();

	@Type(() => MultiDescDLCRecord)
	otherEffects: MultiDescDLCRecord = forceInit();

	@Type(() => DescDLCRecord)
	inspiration: DescDLCRecord = forceInit();

	@IsIn(DLC_STRINGS)
	addedBy: DLCString = forceInit();
}

export class UpdateCivicDTO {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	name?: string;

	@IsIn(ERAS)
	@IsOptional()
	era?: Era;

	@Type(() => StatDLCRecord)
	@IsOptional()
	cost?: StatDLCRecord;

	@Type(() => MultiReferenceDLCRecord)
	@IsOptional()
	dependencies?: MultiReferenceDLCRecord;

	@IsString()
	@IsOptional()
	description?: string;

	@Type(() => StatDLCRecord)
	@IsOptional()
	envoys?: StatDLCRecord;

	@Type(() => StatDLCRecord)
	@IsOptional()
	governorTitles?: StatDLCRecord;

	@Type(() => MultiDescDLCRecord)
	@IsOptional()
	otherEffects?: MultiDescDLCRecord;

	@Type(() => DescDLCRecord)
	@IsOptional()
	inspiration?: DescDLCRecord;

	@IsIn(DLC_STRINGS)
	@IsOptional()
	addedBy?: DLCString;
}

