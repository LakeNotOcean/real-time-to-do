import { Module, ValidationPipe } from '@nestjs/common';

import {
	ExceptionsModule,
	generalConfig,
	getPinoLoggerConfig,
	ValidationException,
} from '@common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE, RouterModule } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma-wrapper/prisma.module';
import { PrismaService } from './prisma-wrapper/prisma.service';
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
	providers: [
		PrismaService,
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				disableErrorMessages: false,
				transform: true,
				exceptionFactory: (errors) => new ValidationException(errors),
			}),
		},
	],
})
export class AppModule {}
