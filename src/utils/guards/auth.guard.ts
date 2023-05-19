import { CanActivate, ConsoleLogger, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
	private _logger: ConsoleLogger = new ConsoleLogger('Auth');

	public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest<Request>();

		this._logger.log(`Received auth attempt with secret ${req.query.secret}`);

		return req.query.secret === process.env.SECRET;
	}
}

