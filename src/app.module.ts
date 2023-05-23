import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CivicsModule } from './civics/civics.module';
import { CivsModule } from './civilizations/civilizations.module';
import { TechnologiesModule } from './technologies/technologies.module';
import { UnitsModule } from './units/units.module';

@Module({
	imports: [CivsModule, UnitsModule, TechnologiesModule, CivicsModule],
	controllers: [AppController],
	providers: []
})
export class AppModule {}

