import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { YieldRecord } from 'src/utils/common';
import { forceInit } from 'src/utils/utils';

export class Terrain {
	@IsString()
	@IsNotEmpty()
	name: string = forceInit();

	@IsString()
	@IsNotEmpty()
	icon: string = forceInit();

	@Type(() => YieldRecord)
	@ValidateNested({ each: true })
	yields: YieldRecord[] = forceInit();

	@IsInt()
	movementCost: number = forceInit();

	@IsString({ each: true })
	weatherEffects: string[] = forceInit();
}

export type MarshalledTerrain = {
	name: string;
	icon: string;
	yields: YieldRecord[];
	movementCost: number;
	weatherEffects: string[];
};
