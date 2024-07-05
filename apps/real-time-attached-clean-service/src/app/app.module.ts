import { generalConfig, PrismaModule } from '@common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanAttachedService } from './services/clear-attached.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
			isGlobal: true,
			cache: true,
			load: [generalConfig],
		}),
		ScheduleModule.forRoot(),
		PrismaModule,
	],
	providers: [CleanAttachedService],
})
export class AppModule {}
