import { PrismaModule } from '@common';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [ScheduleModule.forRoot(), PrismaModule],
})
export class AppModule {}
