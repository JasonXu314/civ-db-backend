import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	public getDashboard(): string {
		return this.appService.getHello();
	}

	@Post('/auth')
	public auth(@Body('secret') secret: string): void {
		if (secret !== process.env.SECRET) {
			throw new UnauthorizedException();
		}
	}
}

