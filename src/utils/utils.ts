import { IsMongoId, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ObjectId } from 'mongodb';

export type DeepPartial<T> = {
	[K in Extract<keyof T, string>]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export class RawIDDTO {
	@IsMongoId()
	@IsOptional()
	id?: string;
}

export class RawIDRequiredDTO {
	@IsMongoId()
	id: string = forceInit();
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

export class IDWithSearchDTO extends IDDTO {
	@IsString()
	@IsOptional()
	query?: string;
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
			if (Array.isArray(value)) {
				copy[prop] = updates[prop];
			} else {
				copy[prop] = deepMerge(copy[prop], updates[prop]);
			}
		} else {
			copy[prop] = updates[prop];
		}
	}

	return copy;
}

