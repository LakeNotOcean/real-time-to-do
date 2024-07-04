import { toMilliseconds } from '@common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Publisher } from 'rabbitmq-client';
import { DURABLE, TYPE } from '../constants';

@Injectable()
export class RabbitMQService {
	private readonly exchangeName: string;
	private amqpConnection: Connection;
	private amqpPublisher: Publisher;

	constructor(private readonly configService: ConfigService) {
		this.exchangeName = configService.getOrThrow<string>('rmqRangeExchange');
	}
	initConnection() {
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
		return this.pomiseWrapper(() =>
			this.amqpConnection.exchangeDeclare({
				exchange: this.exchangeName,
				type: TYPE,
				durable: DURABLE,
				autoDelete: false,
			}),
		);
	}
	async queueDeclare(queueName: string) {
		return this.pomiseWrapper(() =>
			this.amqpConnection.queueDeclare({
				queue: queueName,
				durable: DURABLE,
				autoDelete: false,
				exclusive: false,
				arguments: { 'x-expires': toMilliseconds('15min') },
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
	protected setErrorHandler(reject: (reason?: any) => void) {
		this.amqpConnection.on('error', (err) => reject(err));
	}
	protected pomiseWrapper<T>(promiseFucntion: () => Promise<T>): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			this.setErrorHandler(reject);
			promiseFucntion()
				.then((res: T) => resolve(res))
				.catch((err) => reject(err));
		});
	}
}
