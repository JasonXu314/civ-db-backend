import { Type } from 'class-transformer';
import { IsIn, IsInt, IsMongoId, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Nullable, forceInit } from './utils';

export type Era = 'Ancient' | 'Classical' | 'Medieval' | 'Renaissance' | 'Industrial' | 'Modern' | 'Atomic' | 'Information' | 'Future';
export const ERAS = ['Ancient', 'Classical', 'Medieval', 'Renaissance', 'Industrial', 'Modern', 'Atomic', 'Information', 'Future'];

export type Resource = 'Horses' | 'Iron' | 'Niter' | 'Coal' | 'Oil' | 'Aluminum' | 'Uranium';
export const RESOURCES = ['Horses', 'Iron', 'Niter', 'Coal', 'Oil', 'Aluminum', 'Uranium'] as const;

export enum DLC {
	BASE,
	RF,
	GS
}
export type DLCString = 'base' | 'rf' | 'gs';
export const DLC_STRINGS = ['base', 'rf', 'gs'] as const;

export type DLCRecord<T> = {
	base: T;
	rf: T;
	gs: T;
};

export type PartialOptDLCRecord<T> = {
	base: T;
	rf: T | null;
	gs: T | null;
};

export type OptDLCRecord<T> = {
	base: T | null;
	rf: T | null;
	gs: T | null;
};

export class StatDLCRecord {
	@IsInt()
	base: number = forceInit();

	@IsInt()
	@Nullable()
	rf: number | null = forceInit();

	@IsInt()
	@Nullable()
	gs: number | null = forceInit();
}

export class DescDLCRecord {
	@IsString()
	@Nullable()
	base: string | null = forceInit();

	@IsString()
	@Nullable()
	rf: string | null = forceInit();

	@IsString()
	@Nullable()
	gs: string | null = forceInit();
}

export class MultiDescDLCRecord {
	@IsString({ each: true })
	base: string[] = forceInit();

	@IsString({ each: true })
	rf: string[] = forceInit();

	@IsString({ each: true })
	gs: string[] = forceInit();
}

export class ResourceRequirement {
	@IsIn(RESOURCES)
	resource: Resource = forceInit();

	@IsInt()
	quantity: number = forceInit();
}

export class ResourceDLCRecord {
	@Type(() => ResourceRequirement)
	@Nullable()
	base: ResourceRequirement | null = forceInit();

	@Type(() => ResourceRequirement)
	@Nullable()
	rf: ResourceRequirement | null = forceInit();

	@Type(() => ResourceRequirement)
	@Nullable()
	gs: ResourceRequirement | null = forceInit();
}

export class ReferenceDLCRecord {
	@IsMongoId()
	@Nullable()
	base: ObjectId | null = forceInit();

	@IsMongoId()
	@Nullable()
	rf: ObjectId | null = forceInit();

	@IsMongoId()
	@Nullable()
	gs: ObjectId | null = forceInit();
}

export class MultiReferenceDLCRecord {
	@IsMongoId({ each: true })
	base: ObjectId[] = forceInit();

	@IsMongoId({ each: true })
	rf: ObjectId[] = forceInit();

	@IsMongoId({ each: true })
	gs: ObjectId[] = forceInit();
}

export function dlcValue(dlc: DLCString): DLC {
	switch (dlc) {
		case 'base':
			return DLC.BASE;
		case 'rf':
			return DLC.RF;
		case 'gs':
			return DLC.GS;
		default:
			throw new Error('Bad DLC string');
	}
}

export function toDLCString(dlc: DLC): DLCString {
	switch (dlc) {
		case DLC.BASE:
			return 'base';
		case DLC.RF:
			return 'rf';
		case DLC.GS:
			return 'gs';
		default:
			throw new Error('Bad DLC number');
	}
}

