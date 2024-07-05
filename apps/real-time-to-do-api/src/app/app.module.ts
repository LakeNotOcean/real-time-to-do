import { Module } from '@nestjs/common';

import {
	ExceptionsModule,
	generalConfig,
	getPinoLoggerConfig,
	PrismaModule,
	PrismaService,
} from '@common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { AttachedModule } from './tasks/attached/attached.module';
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
		RouterModule.register([
			{ path: 'users', module: UsersModule },
			{
				path: 'tasks',
				module: TasksModule,
				children: [{ path: 'attached', module: AttachedModule }],
			},
		]),
	],
	providers: [PrismaService],
})
export class AppModule {}
