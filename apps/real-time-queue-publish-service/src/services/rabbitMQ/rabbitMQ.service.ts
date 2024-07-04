import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DURABLE, RabbitMQBaseService, TYPE } from '@rabbitmq';
import { Publisher } from 'rabbitmq-client';

@Injectable()
export class RabbitMQService extends RabbitMQBaseService {
	private amqpPublisher: Publisher;

	constructor(configService: ConfigService) {
		super(configService);
	}

	createPublisher() {
		this.amqpConnection.on('error', (err) => {
			throw err;
		});
		this.amqpPublisher = this.amqpConnection.createPublisher({
			confirm: true,
			maxAttempts: 3,
			exchanges: [
				{
					exchange: this.exchangeName,
					type: TYPE,
					durable: DURABLE,
					autoDelete: false,
				},
			],
		});
	}
	async publishMessage(routingKey: string, message: object) {
		return this.pomiseWrapper(() =>
			this.amqpPublisher.send(
				{
					exchange: this.exchangeName,
					routingKey,
					type: TYPE,
					durable: DURABLE,
				},
				message,
			),
		);
	}
}
