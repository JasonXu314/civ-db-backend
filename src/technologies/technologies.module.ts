import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { TechnologiesController } from './technologies.controller';
import { TechnologiesService } from './technologies.service';

@Module({
	imports: [DBModule],
	controllers: [TechnologiesController],
	providers: [TechnologiesService],
	exports: [TechnologiesService]
})
export class TechnologiesModule {}

