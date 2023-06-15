import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import {
	DLCRecord,
	DLCString,
	DLC_STRINGS,
	DescDLCRecord,
	ERAS,
	Era,
	MultiDescDLCRecord,
	MultiReferenceDLCRecord,
	OptDLCRecord,
	PartialOptDLCRecord,
	StatDLCRecord
} from 'src/utils/common';
import { forceInit } from 'src/utils/utils';

export class Technology {
	@IsString()
	@IsNotEmpty()
	name: string = forceInit();

	@IsUrl()
	icon: string = forceInit();

	@IsIn(ERAS)
	era: Era = forceInit();

	@Type(() => StatDLCRecord)
	cost: StatDLCRecord = forceInit();

	@Type(() => MultiReferenceDLCRecord)
	dependencies: MultiReferenceDLCRecord = forceInit();

	@IsString()
	description: string = forceInit();

	@Type(() => MultiDescDLCRecord)
	otherEffects: MultiDescDLCRecord = forceInit();

	@Type(() => DescDLCRecord)
	eureka: DescDLCRecord = forceInit();

	@IsIn(DLC_STRINGS)
	addedBy: DLCString = forceInit();
}

export type MarshalledTechnology = {
	name: string;
	icon: string;
	era: Era;
	cost: PartialOptDLCRecord<number>;
	prerequisites: DLCRecord<Technology[]>;
	dependents: DLCRecord<Technology[]>;
	description: string;
	otherEffects: DLCRecord<string[]>;
	eureka: OptDLCRecord<string>;
	addedBy: DLCString;
	// TODO: add buildings/districts/improvements/units unlocked when added
};

