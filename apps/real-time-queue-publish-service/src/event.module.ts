import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ASYNC_RABBITMQ } from './services/constants';
import { PgNotifyController } from './services/pgNotify/pg-notify.service';
import { initRabbitMQService } from './services/rabbitMQ/init-rabbitMQ-service';
import { RabbitMQService } from './services/rabbitMQ/rabbitMQ.service';

@Module({
	providers: [
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
	controllers: [PgNotifyController],
})
export class EventModule {}
