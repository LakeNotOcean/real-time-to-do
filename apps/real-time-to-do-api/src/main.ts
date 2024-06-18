import { configSwagger, toEnvEnum } from '@common';
import multiPart from '@fastify/multipart';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app/app.module';
import { BaseInterceptor } from './app/inteceptors/base.inteceptor';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
		{ bufferLogs: true },
	);

	const configService = app.get(ConfigService);

	app.useGlobalInterceptors(
		new ClassSerializerInterceptor(app.get(Reflector)),
		new BaseInterceptor(),
	);
	app.useLogger(app.get(Logger));
	app.register(multiPart, {
		limits: {
			fieldNameSize: 100,
			fieldSize: 1000000,
			fields: 10,
			fileSize: 100,
			files: 1,
			headerPairs: 2000,
		},
	});

	const env = toEnvEnum(configService.getOrThrow<string>('NODE_ENV'));
	configSwagger(
		app,
		env,
		'real-time-to-do',
		'basic api for real-time-to-do app',
	);

	const port = configService.getOrThrow<number>('serverPort');
	const address = configService.getOrThrow<string>('serverAddress');
	await app.listen(port, address);

	BigInt.prototype['toJSON'] = function () {
		const int = Number.parseInt(this.toString());
		return int ?? this.toString();
	};

	console.log('server run on port ' + port, address);
}

bootstrap();
