import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';

@Module({
	imports: [DBModule],
	controllers: [UnitsController],
	providers: [UnitsService],
	exports: [UnitsService]
})
export class UnitsModule {}

