import { Consumer, ConsumerHandler } from 'rabbitmq-client';
import { catchError, defer, firstValueFrom } from 'rxjs';
import { RabbitMQService } from './rabbitMQ.service';

export async function initConsumer(
	rabbitMQService: RabbitMQService,
	queueName: string,
	routingKey: string,
	handler: ConsumerHandler,
	consumerErrorHandler: (err: object) => void,
): Promise<Consumer> {
	const consumerSubsciption = defer(async () => {
		await rabbitMQService.queueDeclare(queueName);
		await rabbitMQService.queueBind(queueName, queueName);
		await rabbitMQService.queueBind(queueName, routingKey);
		const consumer = rabbitMQService.createConsumer(
			queueName,
			handler,
			consumerErrorHandler,
		);
		return consumer;
	}).pipe(
		catchError((err) => {
			throw err;
		}),
	);

	const consumer = await firstValueFrom(consumerSubsciption);
	return consumer;
}
