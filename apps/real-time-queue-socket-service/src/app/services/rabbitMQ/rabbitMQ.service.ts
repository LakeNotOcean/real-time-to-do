import { toMilliseconds } from '@common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	AUTO_DEPETE,
	DURABLE,
	EXCLUSIVE,
	RabbitMQBaseService,
} from '@rabbitmq';
import { ConsumerHandler } from 'rabbitmq-client';

@Injectable()
export class RabbitMQService extends RabbitMQBaseService {
	constructor(configService: ConfigService) {
		super(configService);
	}
	async queueDeclare(queueName: string) {
		return this.pomiseWrapper(() =>
			this.amqpConnection.queueDeclare({
				queue: queueName,
				...queueOptions,
			}),
		);
	}
	async queueBind(queueName: string, routingKey: string) {
		return this.pomiseWrapper(() =>
			this.amqpConnection.queueBind({
				exchange: this.exchangeName,
				queue: queueName,
				routingKey,
			}),
		);
	}
	createConsumer(
		queueName: string,
		handler: ConsumerHandler,
		consumerErrorHandler: (err: unknown) => void,
	) {
		const consumer = this.amqpConnection.createConsumer(
			{
				queue: queueName,
				queueOptions,
				noAck: false,
			},
			handler,
		);
		consumer.on('error', consumerErrorHandler);
		return consumer;
	}
}

const queueOptions = {
	durable: DURABLE,
	autoDelete: AUTO_DEPETE,
	exclusive: EXCLUSIVE,
	arguments: { 'x-expires': toMilliseconds('15min') },
};
