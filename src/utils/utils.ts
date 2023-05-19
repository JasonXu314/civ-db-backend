import { Type } from 'class-transformer';
import { IsIn, IsInt, IsMongoId, IsOptional, ValidateIf } from 'class-validator';
import { ObjectId } from 'mongodb';

export type Resource = 'Horses' | 'Iron' | 'Niter' | 'Coal' | 'Oil' | 'Aluminum' | 'Uranium';
export const RESOURCES = ['Horses', 'Iron', 'Niter', 'Coal', 'Oil', 'Aluminum', 'Uranium'] as const;

export type DeepPartial<T> = {
	[K in Extract<keyof T, string>]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface Updater<T> {
	$set: {
		[K in Extract<keyof T, string>]?: T[K] extends object ? Updater<T[K]> : T[K];
	};
}

export class RawIDDTO {
	@IsMongoId()
	@IsOptional()
	id?: string;
}

export class RawIDRequiredDTO {
	@IsMongoId()
	id: ObjectId = forceInit();
}

export class IDDTO {
	@IsMongoId()
	@IsOptional()
	id?: ObjectId;
}

export class IDRequiredDTO {
	@IsMongoId()
	id: ObjectId = forceInit();
}

export class StatExpansionRecord {
	@IsInt()
	base: number = forceInit();

	@IsInt()
	@Nullable()
	rf: number | null = forceInit();

	@IsInt()
	@Nullable()
	gs: number | null = forceInit();
}

export class ResourceRequirement {
	@IsIn(RESOURCES)
	resource: Resource = forceInit();

	@IsInt()
	quantity: number = forceInit();
}

export class ResourceExpansionRecord {
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

export class ReferenceExpansionRecord {
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

export class MultiReferenceExpansionRecord {
	@IsMongoId({ each: true })
	base: ObjectId[] = forceInit();

	@IsMongoId({ each: true })
	rf: ObjectId[] = forceInit();

	@IsMongoId({ each: true })
	gs: ObjectId[] = forceInit();
}

export function forceInit<T>(): T {
	return undefined as T;
}

export function Nullable() {
	return ValidateIf((_, val) => val !== null);
}

export function deepMerge<T>(obj: T, updates: DeepPartial<T>): T {
	if (!updates) return updates === null ? (null as T) : obj ? { ...obj } : obj;
	if (!obj) return updates ? ({ ...updates } as T) : updates;

	const copy = { ...obj };

	for (const prop in updates) {
		const value = obj[prop];

		if (typeof value === 'object') {
			copy[prop] = deepMerge(copy[prop], updates[prop]);
		} else {
			copy[prop] = updates[prop];
		}
	}

	return copy;
}

