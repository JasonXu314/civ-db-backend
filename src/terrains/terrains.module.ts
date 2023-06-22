import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { TerrainsController } from './terrains.controller';
import { TerrainsService } from './terrains.service';

@Module({
	imports: [DBModule],
	controllers: [TerrainsController],
	providers: [TerrainsService],
	exports: [TerrainsService]
})
export class TerrainsModule {}

