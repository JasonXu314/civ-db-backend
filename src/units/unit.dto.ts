import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DLCString, DLC_STRINGS, ERAS, Era, MultiReferenceDLCRecord, ReferenceDLCRecord, ResourceDLCRecord, StatDLCRecord } from 'src/utils/common';
import { Nullable, forceInit } from 'src/utils/utils';
import { PROMOTION_CLASSES, PromotionClass } from './unit.model';

export class CreateUnitDTO {
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

	@Type(() => StatDLCRecord)
	@IsOptional()
	production?: StatDLCRecord;

	@Type(() => StatDLCRecord)
	@IsOptional()
	gold?: StatDLCRecord;

	@Type(() => StatDLCRecord)
	@IsOptional()
	maintenance?: StatDLCRecord;

	@Type(() => ResourceDLCRecord)
	@IsOptional()
	resource?: ResourceDLCRecord = forceInit();

	@Type(() => ResourceDLCRecord)
	@IsOptional()
	maintenanceResource?: ResourceDLCRecord = forceInit();

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

	@Type(() => ReferenceDLCRecord)
	@IsOptional()
	replaces?: ReferenceDLCRecord;

	@IsString()
	@IsOptional()
	description?: string;

	@Type(() => ReferenceDLCRecord)
	@IsOptional()
	unlockedBy?: ReferenceDLCRecord;

	@Type(() => ReferenceDLCRecord)
	@IsOptional()
	obsoletedBy?: ReferenceDLCRecord;

	@Type(() => MultiReferenceDLCRecord)
	@IsOptional()
	upgradesFrom?: MultiReferenceDLCRecord;

	@Type(() => MultiReferenceDLCRecord)
	@IsOptional()
	upgradesTo?: MultiReferenceDLCRecord;

	@IsIn(DLC_STRINGS)
	@IsOptional()
	addedBy: DLCString = forceInit();
}

