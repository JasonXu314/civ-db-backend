import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { DLCString, DLC_STRINGS, ERAS, Era, MultiReferenceDLCRecord, ReferenceDLCRecord, ResourceDLCRecord, StatDLCRecord } from 'src/utils/common';
import { Nullable, forceInit } from 'src/utils/utils';

export type PromotionClass =
	| 'Recon'
	| 'Melee'
	| 'Ranged'
	| 'Anti-Cavalry'
	| 'Light Cavalry'
	| 'Heavy Cavalry'
	| 'Siege'
	| 'Naval Melee'
	| 'Naval Ranged'
	| 'Naval Raider'
	| 'Naval Carrier'
	| 'Fighter'
	| 'Bomber'
	| 'Warrior Monks'
	| 'Nihang'
	| 'Apostles'
	| 'Spies'
	| 'Rock Bands'
	| 'Giant Death Robots'
	| 'Soothsayers';
export const PROMOTION_CLASSES = [
	'Recon',
	'Melee',
	'Ranged',
	'Anti-Cavalry',
	'Light Cavalry',
	'Heavy Cavalry',
	'Siege',
	'Naval Melee',
	'Naval Ranged',
	'Naval Raider',
	'Naval Carrier',
	'Fighter',
	'Bomber',
	'Warrior Monks',
	'Nihang',
	'Apostles',
	'Spies',
	'Rock Bands',
	'Giant Death Robots',
	'Soothsayers'
];

export class Unit {
	@IsString()
	@IsNotEmpty()
	name: string = forceInit();

	@IsIn(PROMOTION_CLASSES)
	promotionClass: PromotionClass = forceInit();

	@IsIn(ERAS)
	era: Era = forceInit();

	@Type(() => StatDLCRecord)
	production: StatDLCRecord = forceInit();

	@Type(() => StatDLCRecord)
	gold: StatDLCRecord = forceInit();

	@Type(() => StatDLCRecord)
	maintenance: StatDLCRecord = forceInit();

	@Type(() => ResourceDLCRecord)
	resource: ResourceDLCRecord = forceInit();

	@Type(() => ResourceDLCRecord)
	maintenanceResource: ResourceDLCRecord = forceInit();

	@IsUrl()
	icon: string = forceInit();

	@IsBoolean()
	unique: boolean = forceInit();

	@IsInt()
	movement: number = forceInit();

	@IsInt()
	sight: number = forceInit();

	@IsInt()
	strength: number = forceInit();

	@IsInt()
	range: number = forceInit();

	@IsInt()
	@Nullable()
	rangedStrength: number | null = forceInit();

	@IsInt()
	@Nullable()
	bombardStrength: number | null = forceInit();

	@IsInt()
	@Nullable()
	aaStrength: number | null = forceInit();

	@Type(() => ReferenceDLCRecord)
	replaces: ReferenceDLCRecord = forceInit();

	@IsString()
	description: string = forceInit();

	@Type(() => ReferenceDLCRecord)
	unlockedBy: ReferenceDLCRecord = forceInit();

	@Type(() => ReferenceDLCRecord)
	obsoletedBy: ReferenceDLCRecord = forceInit();

	@Type(() => MultiReferenceDLCRecord)
	upgradesFrom: MultiReferenceDLCRecord = forceInit();

	@Type(() => MultiReferenceDLCRecord)
	upgradesTo: MultiReferenceDLCRecord = forceInit();

	@IsIn(DLC_STRINGS)
	addedBy: DLCString = forceInit();
}

