import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { MultiReferenceExpansionRecord, Nullable, ReferenceExpansionRecord, StatExpansionRecord, forceInit } from 'src/utils/utils';

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

export type Era = 'Ancient' | 'Classical' | 'Medieval' | 'Renaissance' | 'Industrial' | 'Modern' | 'Atomic' | 'Information';

export class Unit {
	@IsString()
	@IsNotEmpty()
	name: string = forceInit();

	@IsIn([
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
	])
	promotionClass: PromotionClass = forceInit();

	@IsIn(['Ancient', 'Classical', 'Medieval', 'Renaissance', 'Industrial', 'Modern', 'Atomic', 'Information'])
	era: Era = forceInit();

	@Type(() => StatExpansionRecord)
	production: StatExpansionRecord = forceInit();

	@Type(() => StatExpansionRecord)
	gold: StatExpansionRecord = forceInit();

	@Type(() => StatExpansionRecord)
	maintenance: StatExpansionRecord = forceInit();

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

	@Type(() => ReferenceExpansionRecord)
	replaces: ReferenceExpansionRecord = forceInit();

	@IsString()
	description: string = forceInit();

	@Type(() => ReferenceExpansionRecord)
	unlockedBy: ReferenceExpansionRecord = forceInit();

	@Type(() => ReferenceExpansionRecord)
	obsoletedBy: ReferenceExpansionRecord = forceInit();

	@Type(() => MultiReferenceExpansionRecord)
	upgradesFrom: MultiReferenceExpansionRecord = forceInit();

	@Type(() => MultiReferenceExpansionRecord)
	upgradesTo: MultiReferenceExpansionRecord = forceInit();
}

