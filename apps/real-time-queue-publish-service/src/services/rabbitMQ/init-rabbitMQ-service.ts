import { JsonLogger, toMilliseconds } from '@common';
import { catchError, defer, retry } from 'rxjs';
import { RabbitMQService } from './rabbitMQ.service';

const logger = new JsonLogger('initRabbitMQService');

export async function initRabbitMQService(
	rabbitMQService: RabbitMQService,
): Promise<void> {
	defer(async () => {
		rabbitMQService.initConnection();
		await rabbitMQService.exchangeDeclare();
		rabbitMQService.createPublisher();
	})
		.pipe(
			catchError((err: object, caught) => {
				logger.error(err);
				return caught;
			}),
			retry({ delay: toMilliseconds('5s') }),
		)
		.subscribe();
}
