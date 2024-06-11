import { Module } from '@nestjs/common';
import { AttachedController } from './attached.controller';
import { AttachedService } from './attached.service';

@Module({
	controllers: [AttachedController],
	providers: [AttachedService],
})
export class AttachedModule {}
