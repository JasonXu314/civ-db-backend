import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { FeaturesModule } from 'src/features/features.module';
import { TechnologiesModule } from 'src/technologies/technologies.module';
import { TerrainsModule } from 'src/terrains/terrains.module';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';

@Module({
	imports: [DBModule, TechnologiesModule, TerrainsModule, FeaturesModule],
	controllers: [ResourcesController],
	providers: [ResourcesService],
	exports: [ResourcesService]
})
export class ResourcesModule {}

