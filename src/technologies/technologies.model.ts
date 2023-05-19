import { IsIn, IsMongoId, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ObjectId } from 'mongodb';
import { ERAS, Era } from 'src/utils/common';
import { forceInit } from 'src/utils/utils';

export class Technology {
	@IsString()
	@IsNotEmpty()
	name: string = forceInit();

	@IsUrl()
	icon: string = forceInit();

	@IsIn(ERAS)
	era: Era = forceInit();

	@IsMongoId({ each: true })
	prerequisites: ObjectId[] = forceInit();

	@IsMongoId({ each: true })
	dependents: ObjectId[] = forceInit();

	@IsString()
	description: string = forceInit();

	@IsString({ each: true })
	otherEffects: string[] = forceInit();

	@IsString()
	eureka: string = forceInit();
}

