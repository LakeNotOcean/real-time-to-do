import { Module } from '@nestjs/common';

import { generalConfig, getPinoLoggerConfig } from '@common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

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
	],
	controllers: [UsersController],
	providers: [UsersService],
})
export class AppModule {}
