import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DLCString, DLC_STRINGS, DescDLCRecord, ERAS, Era, MultiDescDLCRecord, MultiReferenceDLCRecord } from 'src/utils/common';
import { forceInit } from 'src/utils/utils';

export class CreateTechnologyDTO {
	@IsString()
	@IsNotEmpty()
	name: string = forceInit();

	@IsIn(ERAS)
	era: Era = forceInit();

	@Type(() => MultiReferenceDLCRecord)
	dependencies: MultiReferenceDLCRecord = forceInit();

	@IsString()
	description: string = forceInit();

	@Type(() => MultiDescDLCRecord)
	otherEffects: MultiDescDLCRecord = forceInit();

	@Type(() => DescDLCRecord)
	eureka: DescDLCRecord = forceInit();

	@IsIn(DLC_STRINGS)
	addedBy: DLCString = forceInit();
}

export class UpdateTechnologyDTO {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	name?: string;

	@IsIn(ERAS)
	@IsOptional()
	era?: Era;

	@Type(() => MultiReferenceDLCRecord)
	@IsOptional()
	dependencies?: MultiReferenceDLCRecord;

	@IsString()
	@IsOptional()
	description?: string;

	@Type(() => MultiDescDLCRecord)
	@IsOptional()
	otherEffects?: MultiDescDLCRecord;

	@Type(() => DescDLCRecord)
	@IsOptional()
	eureka?: DescDLCRecord;

	@IsIn(DLC_STRINGS)
	@IsOptional()
	addedBy?: DLCString;
}

