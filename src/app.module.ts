import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CivicsModule } from './civics/civics.module';
import { CivsModule } from './civilizations/civilizations.module';
import { FeaturesModule } from './features/features.module';
import { TechnologiesModule } from './technologies/technologies.module';
import { TerrainsModule } from './terrains/terrains.module';
import { UnitsModule } from './units/units.module';

@Module({
	imports: [CivsModule, UnitsModule, TechnologiesModule, CivicsModule, TerrainsModule, FeaturesModule],
	controllers: [AppController],
	providers: []
})
export class AppModule {}

