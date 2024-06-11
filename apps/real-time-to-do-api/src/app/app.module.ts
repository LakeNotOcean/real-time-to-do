import { Module } from '@nestjs/common';

import { ExceptionsModule, generalConfig, getPinoLoggerConfig } from '@common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma-wrapper/prisma.module';
import { PrismaService } from './prisma-wrapper/prisma.service';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
			isGlobal: true,
			cache: true,
			load: [generalConfig],
		}),
		LoggerModule.forRootAsync({
			useFactory: async (configService: ConfigService) =>
				getPinoLoggerConfig(configService),
			inject: [ConfigService],
		}),
		UsersModule,
		TasksModule,
		PrismaModule,
		ExceptionsModule.forRoot(),
	],
	providers: [PrismaService],
})
export class AppModule {}
