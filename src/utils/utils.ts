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

export class NameSearchDTO {
	@IsString()
	name: string = forceInit();
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
			} else if (value === null) {
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

export function isUncapitalizedWord(word: string): boolean {
	return ['of', 'the', 'a'].includes(word);
}

export function reformatName(normalizedName: string): string {
	return normalizedName.replace(/_/g, ' ');
}

export function normalizeName(name: string): string {
	return name
		.split(/[\s_]/)
		.map((word, i) => (i === 0 || !isUncapitalizedWord(word) ? word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase() : word))
		.join('_');
}

export function matchQuery<K extends string>(obj: { [key in K]: string }, query: string, ...fields: K[]): boolean {
	return fields.some((field) => {
		const value = obj[field].toLowerCase();
		const q = query.toLowerCase();
		const vws = value.replace(/\s/g, '');
		const qws = q.replace(/\s/g, '');
		const vFrags = value.split(/s/);
		const qFrags = q.split(/s/);

		return (
			value.includes(q) ||
			q.includes(value) ||
			vws.includes(qws) ||
			qws.includes(vws) ||
			qFrags.every((f) => vFrags.some((fragment) => fragment.includes(f) || f.includes(fragment)))
		);
	});
}

