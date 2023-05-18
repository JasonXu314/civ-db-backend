import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CivsModule } from './civilizations/civilizations.module';
import { UnitsModule } from './units/units.module';

@Module({
	imports: [CivsModule, UnitsModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}

