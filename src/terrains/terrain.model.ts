import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { YieldRecord } from 'src/utils/common';
import { forceInit } from 'src/utils/utils';

export class Terrain {
	@IsString()
	@IsNotEmpty()
	name: string = forceInit();

	@IsString()
	@IsNotEmpty()
	icon: string = forceInit();

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

export type MarshalledTerrain = {
	name: string;
	icon: string;
	description: string;
	yields: YieldRecord[];
	movementCost: number;
	defenseModifier: number;
	impassable: boolean;
	weatherEffects: string[];
};

