import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { TerrainsService } from './terrains.service';

@Module({
	imports: [DBModule],
	controllers: [],
	providers: [TerrainsService],
	exports: [TerrainsService]
})
export class TerrainsModule {}

