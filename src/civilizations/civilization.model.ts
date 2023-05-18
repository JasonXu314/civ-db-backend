import { IsArray, IsString, IsUrl, Length } from 'class-validator';
import { forceInit } from 'src/utils/utils';

export class CivilizationAbility {
	@IsString()
	name: string = forceInit();

	@IsString()
	description: string = forceInit();
}

export class Civilization {
	@IsString()
	@Length(24, 24)
	_id: string = forceInit();

	@IsString()
	name: string = forceInit();

	@IsUrl()
	icon: string = forceInit();

	@IsArray({ each: true })
	abilities: CivilizationAbility[] = forceInit();

	// TODO: figure out how to represent units and stuff

	@IsString()
	description: string = forceInit();
}

