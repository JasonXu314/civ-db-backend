import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ERAS, Era } from 'src/utils/common';
import { MultiReferenceExpansionRecord, Nullable, ReferenceExpansionRecord, ResourceExpansionRecord, StatExpansionRecord, forceInit } from 'src/utils/utils';
import { PROMOTION_CLASSES, PromotionClass } from './units.model';

export class CreateUnitDTO {
	@IsString()
	@IsNotEmpty()
	name: string = forceInit();

	@IsIn(PROMOTION_CLASSES)
	promotionClass: PromotionClass = forceInit();

	@IsIn(ERAS)
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

	@IsIn(PROMOTION_CLASSES)
	@IsOptional()
	promotionClass?: PromotionClass;

	@IsIn(ERAS)
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

