import { PrismaModule } from '@common';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanAttachedService } from './services/clear-attached.service';

@Module({
	imports: [ScheduleModule.forRoot(), PrismaModule],
	providers: [CleanAttachedService],
})
export class AppModule {}
