import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from './utils/guards/auth.guard';

@Controller()
export class AppController {
	constructor() {}

	@Post('/wakeup')
	public wakeup(): void {}

	@Post('/auth')
	@UseGuards(AuthGuard)
	public auth(): void {}
}

