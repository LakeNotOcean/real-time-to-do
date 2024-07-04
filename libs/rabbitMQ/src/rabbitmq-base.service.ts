import { ConfigService } from '@nestjs/config';
import Connection from 'rabbitmq-client';
import { DURABLE, TYPE } from './constants';

export abstract class RabbitMQBaseService {
	protected readonly exchangeName: string;
	protected amqpConnection: Connection;

	constructor(protected readonly configService: ConfigService) {
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
