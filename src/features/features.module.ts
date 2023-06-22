import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { FeaturesController } from './features.controller';
import { FeaturessService } from './features.service';

@Module({
	imports: [DBModule],
	controllers: [FeaturesController],
	providers: [FeaturessService],
	exports: [FeaturessService]
})
export class FeaturesModule {}

