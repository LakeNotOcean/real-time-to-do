import { JsonLogger, toMilliseconds } from '@common';
import { defer, retry } from 'rxjs';
import { rxjsCatchErrorWithLog } from '../../utils/rxjs.catch-error';
import { RabbitMQService } from './rabbitMQ.service';

const logger = new JsonLogger('initRabbitMQService');

export async function initRabbitMQService(
	rabbitMQService: RabbitMQService,
): Promise<void> {
	defer(async () => {
		await rabbitMQService.initConnection();
		await rabbitMQService.exchangeDeclare();
		await rabbitMQService.createPublisher();
	})
		.pipe(rxjsCatchErrorWithLog(logger), retry({ delay: toMilliseconds('5s') }))
		.subscribe();
}
