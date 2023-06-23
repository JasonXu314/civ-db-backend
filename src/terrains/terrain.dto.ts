import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { YieldRecord } from 'src/utils/common';
import { forceInit } from 'src/utils/utils';

export class CreateTerrainDTO {
	@IsString()
	@IsNotEmpty()
	name: string = forceInit();

	@IsString()
	description: string = forceInit();

	@Type(() => YieldRecord)
	@ValidateNested({ each: true })
	yields: YieldRecord[] = forceInit();

	@IsInt()
	movementCost: number = forceInit();

	@IsInt()
	defenseModifier: number = forceInit();

	@IsBoolean()
	impassable: boolean = forceInit();

	@IsString({ each: true })
	weatherEffects: string[] = forceInit();
}

export class UpdateTerrainDTO {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	name?: string;

	@Type(() => YieldRecord)
	@ValidateNested({ each: true })
	@IsOptional()
	yields?: YieldRecord[];

	@IsString()
	@IsOptional()
	description?: string;

	@IsInt()
	@IsOptional()
	movementCost?: number;

	@IsInt()
	@IsOptional()
	defenseModifier?: number;

	@IsBoolean()
	@IsOptional()
	impassable?: boolean;

	@IsString({ each: true })
	@IsOptional()
	weatherEffects?: string[];
}

