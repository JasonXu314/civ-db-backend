import { Type } from 'class-transformer';
import { IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DLCString, DLC_STRINGS, YieldRecord } from 'src/utils/common';
import { forceInit } from 'src/utils/utils';

export class CreateResourceDTO {
	@IsString()
	@IsNotEmpty()
	name: string = forceInit();

	@IsString()
	description: string = forceInit();

	@IsIn(DLC_STRINGS)
	addedBy: DLCString = forceInit();

	@IsMongoId({ each: true })
	validTerrain: string[] = forceInit();

	@IsMongoId({ each: true })
	validFeatures: string[] = forceInit();

	@Type(() => YieldRecord)
	@ValidateNested({ each: true })
	yieldModifier: YieldRecord[] = forceInit();

	@Type(() => YieldRecord)
	@ValidateNested()
	harvestYield: YieldRecord = forceInit();

	@IsMongoId()
	harvestTech: string = forceInit();

	@IsString({ each: true })
	otherNotes: string[] = forceInit();
}

export class UpdateResourceDTO {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	name?: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	icon?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsIn(DLC_STRINGS)
	@IsOptional()
	addedBy?: DLCString;

	@IsMongoId({ each: true })
	@IsOptional()
	validTerrain?: string[];

	@IsMongoId({ each: true })
	@IsOptional()
	validFeatures?: string[];

	@Type(() => YieldRecord)
	@ValidateNested({ each: true })
	@IsOptional()
	yieldModifier?: YieldRecord[];

	@Type(() => YieldRecord)
	@ValidateNested()
	@IsOptional()
	harvestYield?: YieldRecord;

	@IsMongoId()
	@IsOptional()
	harvestTech?: string;

	@IsString({ each: true })
	@IsOptional()
	otherNotes?: string[];
}

