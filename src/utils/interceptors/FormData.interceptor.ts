import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

export class FormDataInterceptor implements NestInterceptor {
	public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const req = context.switchToHttp().getRequest<Request>();

		if (req.header('Content-Type')?.startsWith('multipart/form-data')) {
			for (const prop in req.body) {
				try {
					req.body[prop] = JSON.parse(req.body[prop]);
				} catch (_) {}
			}
		}

		return next.handle();
	}
}

