import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import axios from 'axios';
import { config } from 'dotenv';
import { AppModule } from './app.module';

config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe());
	app.enableCors({ origin: true });

	await app.listen(process.env.PORT || 8000);

	setInterval(() => {
		axios.post('/wakeup');
	}, 25_000);
}
bootstrap();

