import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MultiReferenceExpansionRecord, Nullable, ReferenceExpansionRecord, ResourceExpansionRecord, StatExpansionRecord, forceInit } from 'src/utils/utils';
import { Era, PromotionClass } from './units.model';

export class CreateUnitDTO {
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

	@Type(() => ResourceExpansionRecord)
	resource: ResourceExpansionRecord = forceInit();

	@Type(() => ResourceExpansionRecord)
	maintenanceResource: ResourceExpansionRecord = forceInit();

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

export class UpdateUnitDTO {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	name?: string;

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
	@IsOptional()
	promotionClass?: PromotionClass;

	@IsIn(['Ancient', 'Classical', 'Medieval', 'Renaissance', 'Industrial', 'Modern', 'Atomic', 'Information'])
	@IsOptional()
	era?: Era;

	@Type(() => StatExpansionRecord)
	@IsOptional()
	production?: StatExpansionRecord;

	@Type(() => StatExpansionRecord)
	@IsOptional()
	gold?: StatExpansionRecord;

	@Type(() => StatExpansionRecord)
	@IsOptional()
	maintenance?: StatExpansionRecord;

	@Type(() => ResourceExpansionRecord)
	@IsOptional()
	resource?: ResourceExpansionRecord = forceInit();

	@Type(() => ResourceExpansionRecord)
	@IsOptional()
	maintenanceResource?: ResourceExpansionRecord = forceInit();

	@IsBoolean()
	@IsOptional()
	unique?: boolean;

	@IsInt()
	@IsOptional()
	movement?: number;

	@IsInt()
	@IsOptional()
	sight?: number;

	@IsInt()
	@IsOptional()
	strength?: number;

	@IsInt()
	@IsOptional()
	range?: number;

	@IsInt()
	@Nullable()
	@IsOptional()
	rangedStrength?: number | null;

	@IsInt()
	@Nullable()
	@IsOptional()
	bombardStrength?: number | null;

	@IsInt()
	@Nullable()
	@IsOptional()
	aaStrength?: number | null;

	@Type(() => ReferenceExpansionRecord)
	@IsOptional()
	replaces?: ReferenceExpansionRecord;

	@IsString()
	@IsOptional()
	description?: string;

	@Type(() => ReferenceExpansionRecord)
	@IsOptional()
	unlockedBy?: ReferenceExpansionRecord;

	@Type(() => ReferenceExpansionRecord)
	@IsOptional()
	obsoletedBy?: ReferenceExpansionRecord;

	@Type(() => MultiReferenceExpansionRecord)
	@IsOptional()
	upgradesFrom?: MultiReferenceExpansionRecord;

	@Type(() => MultiReferenceExpansionRecord)
	@IsOptional()
	upgradesTo?: MultiReferenceExpansionRecord;
}

