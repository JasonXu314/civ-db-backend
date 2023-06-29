import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';

@Module({
	imports: [DBModule],
	controllers: [FeaturesController],
	providers: [FeaturesService],
	exports: [FeaturesService]
})
export class FeaturesModule {}

