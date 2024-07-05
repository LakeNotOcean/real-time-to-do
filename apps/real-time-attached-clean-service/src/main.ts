import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { CleanServiceTransportSrtategy } from './app/clean-service-transport.strategy';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			strategy: new CleanServiceTransportSrtategy(),
		},
	);
	await app.listen();
}

bootstrap();
