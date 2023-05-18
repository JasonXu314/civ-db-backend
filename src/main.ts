import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { AppModule } from './app.module';

config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());

	app.useGlobalPipes(new ValidationPipe());
	app.enableCors({ origin: true, credentials: true });

	await app.listen(process.env.PORT || 8000);
}
bootstrap();

