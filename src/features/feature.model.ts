import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsMongoId, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { DLCString, DLC_STRINGS, YieldRecord } from 'src/utils/common';
import { forceInit } from 'src/utils/utils';

export class Feature {
	@IsString()
	@IsNotEmpty()
	name: string = forceInit();

	@IsString()
	@IsNotEmpty()
	icon: string = forceInit();

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

export type MarshalledFeature = {
	name: string;
	icon: string;
	description: string;
	addedBy: DLCString;
	validTerrain: string[];
	yieldModifier: YieldRecord[];
	harvestYield: YieldRecord[];
	movementCostModifier: number;
	defenseModifier: number;
	removable: boolean;
	impassable: boolean;
	harvestable: boolean;
};

