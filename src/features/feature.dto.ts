import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DLCString, DLC_STRINGS, YieldRecord } from 'src/utils/common';
import { forceInit } from 'src/utils/utils';

export class CreateFeatureDTO {
	@IsString()
	@IsNotEmpty()
	name: string = forceInit();

	@IsString()
	description: string = forceInit();

	@IsIn(DLC_STRINGS)
	addedBy: DLCString = forceInit();

	@IsMongoId({ each: true })
	validTerrain: string[] = forceInit();

	@Type(() => YieldRecord)
	@ValidateNested({ each: true })
	yieldModifier: YieldRecord[] = forceInit();

	@Type(() => YieldRecord)
	@ValidateNested({ each: true })
	harvestYield: YieldRecord[] = forceInit();

	@IsInt()
	movementCostModifier: number = forceInit();

	@IsInt()
	defenseModifier: number = forceInit();

	@IsBoolean()
	removable: boolean = forceInit();

	@IsBoolean()
	impassable: boolean = forceInit();

	@IsBoolean()
	harvestable: boolean = forceInit();
}

export class UpdateFeatureDTO {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	name?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsIn(DLC_STRINGS)
	@IsOptional()
	addedBy?: DLCString;

	@IsMongoId({ each: true })
	@IsOptional()
	validTerrain?: string[];

	@Type(() => YieldRecord)
	@ValidateNested({ each: true })
	@IsOptional()
	yieldModifier?: YieldRecord[];

	@Type(() => YieldRecord)
	@ValidateNested()
	@IsOptional()
	harvestYield?: YieldRecord[];

	@IsInt()
	@IsOptional()
	movementCostModifier?: number;

	@IsInt()
	@IsOptional()
	defenseModifier?: number;

	@IsBoolean()
	@IsOptional()
	removable?: boolean;

	@IsBoolean()
	@IsOptional()
	impassable?: boolean;

	@IsBoolean()
	@IsOptional()
	harvestable?: boolean;
}

