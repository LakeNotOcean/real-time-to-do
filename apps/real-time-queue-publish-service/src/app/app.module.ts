import { generalConfig, getPinoLoggerConfig } from '@common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { PublishModule } from './publish.module';

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
		PublishModule,
	],
})
export class AppModule {}
