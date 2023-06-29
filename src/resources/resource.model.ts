import { Type } from 'class-transformer';
import { IsIn, IsMongoId, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Feature } from 'src/features/feature.model';
import { Technology } from 'src/technologies/technology.model';
import { Terrain } from 'src/terrains/terrain.model';
import { DLCString, DLC_STRINGS, YieldRecord } from 'src/utils/common';
import { forceInit } from 'src/utils/utils';

export class Resource {
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

export type MarshalledResource = {
	name: string;
	icon: string;
	description: string;
	addedBy: DLCString;
	validTerrain: Terrain[];
	validFeatures: Feature[];
	yieldModifier: YieldRecord[];
	harvestYield: YieldRecord;
	harvestTech: Technology;
	otherNotes: string[];
};

