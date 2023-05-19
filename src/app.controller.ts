import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './utils/guards/auth.guard';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	public getDashboard(): string {
		return this.appService.getHello();
	}

	@Post('/auth')
	@UseGuards(AuthGuard)
	public auth(): void {}
}

