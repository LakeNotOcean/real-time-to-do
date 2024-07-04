import { JsonLogger, toMilliseconds } from '@common';
import { rxjsCatchErrorWithLog } from '@rabbitmq';
import { defer, Observable, retry } from 'rxjs';
import { RabbitMQService } from './rabbitMQ.service';

const logger = new JsonLogger('rabbitMQPublishMessage');

export async function rabbitMQPublishMessage<T extends object>(
	rabbitMQService: RabbitMQService,
	routingKey: string,
	message: T,
): Promise<Observable<void>> {
	const observable = defer(async () => {
		await rabbitMQService.publishMessage(routingKey, message);
	}).pipe(
		rxjsCatchErrorWithLog(logger),
		retry({ delay: toMilliseconds('5s'), count: 3 }),
	);
	return observable;
}
