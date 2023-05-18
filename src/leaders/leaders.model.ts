import { IsArray, IsString, IsUrl, Length } from 'class-validator';
import { forceInit } from 'src/utils/utils';

export class LeaderAbility {
	@IsString()
	name: string = forceInit();

	@IsString()
	description: string = forceInit();
}

export class Leader {
	@IsString()
	@Length(24, 24)
	_id: string = forceInit();

	@IsString()
	name: string = forceInit();

	@IsString()
	@Length(24, 24)
	civilization: string = forceInit();

	@IsUrl()
	icon: string = forceInit();

	@IsArray({ each: true })
	abilities: LeaderAbility[] = forceInit();
}

