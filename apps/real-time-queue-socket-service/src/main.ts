import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SocketIoAdapter } from './app/services/socket/socket-io.adapter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	const port = Number(
		configService.getOrThrow<number>('queueSocketServerPort'),
	);
	app.useWebSocketAdapter(new SocketIoAdapter(app, configService));
	await app.startAllMicroservices();
	await app.listen(port);
}
bootstrap();
