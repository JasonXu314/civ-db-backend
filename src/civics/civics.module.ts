import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { CivicsController } from './civics.controller';
import { CivicsService } from './civics.service';

@Module({
	imports: [DBModule],
	controllers: [CivicsController],
	providers: [CivicsService],
	exports: [CivicsService]
})
export class TechnologiesModule {}

