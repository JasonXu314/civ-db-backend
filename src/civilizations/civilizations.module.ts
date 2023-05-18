import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { CivsController } from './civilizations.controller';

@Module({
	imports: [DBModule],
	controllers: [CivsController],
	providers: []
})
export class CivsModule {}

