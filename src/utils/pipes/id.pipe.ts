import { PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

export class IDPipe implements PipeTransform {
	private _fields: string[];

	public constructor(...fields: string[]) {
		this._fields = fields.length === 0 ? ['id'] : fields;
	}

	public transform(value: any): any {
		const copy = { ...value };

		for (const field of this._fields) {
			const value = copy[field];

			if (typeof value === 'string') {
				copy[field] = ObjectId.createFromHexString(copy[field]);
			} else if (typeof value === 'object' && Array.isArray(value)) {
				copy[field] = value.map((id: string) => ObjectId.createFromHexString(id));
			}
		}

		return copy;
	}
}

