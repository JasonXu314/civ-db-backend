import { Controller, ForbiddenException, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { AuthGuard } from './utils/guards/auth.guard';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	public getDashboard(): string {
		return this.appService.getHello();
	}

	@Get('/cookie')
	public getCookie(@Res() res: Response, @Query('secret') secret: string): void {
		if (secret === process.env.SECRET) {
			res.setHeader('Set-Cookie', `civdb:secret=${process.env.SECRET}`);
			res.send();
		} else {
			throw new ForbiddenException('Incorrect token');
		}
	}

	@Post('/auth')
	@UseGuards(AuthGuard)
	public auth(): void {}
}

