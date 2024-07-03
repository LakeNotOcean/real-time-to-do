import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { PgNotifyServer } from 'nestjs-pg-notify';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	app.connectMicroservice<MicroserviceOptions>({
		strategy: new PgNotifyServer({
			connection: {
				host: configService.getOrThrow<string>('postgresHost'),
				port: Number(configService.getOrThrow<number>('postgresPort')),
				database: configService.getOrThrow<string>('postgresDatabase'),
				user: configService.getOrThrow<string>('postgresUsername'),
				password: configService.getOrThrow<string>('postgresPassword'),
			},
			logger: app.get(Logger),
			strategy: {
				retryInterval: 3000,
				retryTimeout: Infinity,
			},
		}),
	});
	app.useLogger(app.get(Logger));

	await app.startAllMicroservices();

	const port = Number(
		configService.getOrThrow<number>('queuePublishServerPort'),
	);
	await app.listen(port);
}
bootstrap();
