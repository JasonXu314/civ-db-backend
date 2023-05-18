import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
	public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest<Request>();

		return req.cookies['civdb:secret'] === process.env.SECRET;
	}
}

