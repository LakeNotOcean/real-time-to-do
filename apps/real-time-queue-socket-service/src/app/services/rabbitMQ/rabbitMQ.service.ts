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
	private readonly queueExpireIn: number;

	constructor(configService: ConfigService) {
		super(configService);
		this.queueExpireIn = toMilliseconds(
			configService.getOrThrow<string>('rmqQueueExpiresIn'),
		);
	}
	async queueDeclare(queueName: string) {
		return this.pomiseWrapper(() =>
			this.amqpConnection.queueDeclare({
				queue: queueName,
				...getQueueOptions(this.queueExpireIn),
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
				queueOptions: getQueueOptions(this.queueExpireIn),
				noAck: false,
			},
			handler,
		);
		consumer.on('error', consumerErrorHandler);
		return consumer;
	}
}

function getQueueOptions(expiresIn: number): object {
	return {
		durable: DURABLE,
		autoDelete: AUTO_DEPETE,
		exclusive: EXCLUSIVE,
		arguments: { 'x-expires': expiresIn },
	};
}
