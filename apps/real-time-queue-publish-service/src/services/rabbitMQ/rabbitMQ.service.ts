import { toMilliseconds } from '@common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Publisher } from 'rabbitmq-client';

@Injectable()
export class RabbitMQService {
	private readonly exchangeName: string;
	private amqpConnection: Connection;
	private amqpPublisher: Publisher;

	constructor(private readonly configService: ConfigService) {
		this.exchangeName = configService.getOrThrow<string>('rmqRangeExchange');
	}
	async initConnection() {
		this.amqpConnection = new Connection(
			'amqp://' +
				this.configService.getOrThrow<string>('rmqUser') +
				':' +
				this.configService.getOrThrow<string>('rmqPassword') +
				'@' +
				this.configService.getOrThrow<string>('rmqHost') +
				':' +
				this.configService.getOrThrow<number>('rmqPort') +
				'/',
		);
	}
	async exchangeDeclare() {
		await this.amqpConnection.exchangeDeclare({
			exchange: this.exchangeName,
			type: 'topic',
			durable: true,
			autoDelete: false,
		});
	}
	async queueDeclare(queueName: string) {
		await this.amqpConnection.queueDeclare({
			queue: queueName,
			durable: false,
			autoDelete: false,
			exclusive: false,
			arguments: { 'x-expires': toMilliseconds('15min') },
		});
	}
	async queueBind(queueName: string, routingKey: string) {
		await this.amqpConnection.queueBind({
			exchange: this.exchangeName,
			queue: queueName,
			routingKey,
		});
	}
	async createPublisher() {
		this.amqpPublisher = this.amqpConnection.createPublisher({
			confirm: true,
			maxAttempts: 3,
			exchanges: [{ exchange: this.exchangeName }],
		});
	}
	async publishMessage(routingKey: string, message: object) {
		await this.amqpPublisher.send(
			{ exchange: this.exchangeName, routingKey },
			message,
		);
	}
}
