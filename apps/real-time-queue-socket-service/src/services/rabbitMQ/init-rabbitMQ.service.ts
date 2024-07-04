import { JsonLogger, toMilliseconds } from '@common';
import { rxjsCatchErrorWithLog } from '@rabbitmq';
import { defer, retry } from 'rxjs';
import { RabbitMQService } from './rabbitMQ.service';

const logger = new JsonLogger('initRabbitMQService');

export async function initRabbitMQService(
	rabbitMQService: RabbitMQService,
): Promise<void> {
	defer(async () => {
		rabbitMQService.initConnection();
		await rabbitMQService.exchangeDeclare();
	})
		.pipe(rxjsCatchErrorWithLog(logger), retry({ delay: toMilliseconds('5s') }))
		.subscribe();
}
