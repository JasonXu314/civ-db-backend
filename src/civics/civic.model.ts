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
	StatDLCRecord
} from 'src/utils/common';
import { forceInit } from 'src/utils/utils';

export class Civic {
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

	@Type(() => StatDLCRecord)
	envoys: StatDLCRecord = forceInit();

	@Type(() => StatDLCRecord)
	governorTitles: StatDLCRecord = forceInit();

	@Type(() => MultiDescDLCRecord)
	otherEffects: MultiDescDLCRecord = forceInit();

	@Type(() => DescDLCRecord)
	inspiration: DescDLCRecord = forceInit();

	@IsIn(DLC_STRINGS)
	addedBy: DLCString = forceInit();
}

export type MarshalledCivic = {
	name: string;
	icon: string;
	era: Era;
	cost: OptDLCRecord<number>;
	dependencies: DLCRecord<Civic[]>;
	dependents: DLCRecord<Civic[]>;
	description: string;
	envoys: OptDLCRecord<number>;
	governorTitles: OptDLCRecord<number>;
	otherEffects: DLCRecord<string[]>;
	inspiration: OptDLCRecord<string>;
	addedBy: DLCString;
	// TODO: add buildings/districts/improvements/units unlocked when added
};

