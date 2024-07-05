import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ASYNC_RABBITMQ } from '@rabbitmq';
import { initRabbitMQService } from './services/rabbitMQ/init-rabbitMQ.service';
import { RabbitMQService } from './services/rabbitMQ/rabbitMQ.service';
import { SocketGateway } from './services/socket/socket.gateway';

@Module({
	providers: [
		SocketGateway,
		{
			provide: ASYNC_RABBITMQ,
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const service = new RabbitMQService(configService);
				await initRabbitMQService(service);
				return service;
			},
		},
	],
})
export class EventModule {}
