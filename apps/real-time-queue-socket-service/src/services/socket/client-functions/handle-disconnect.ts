import { JsonLogger } from '@common';
import { Consumer } from 'rabbitmq-client';
import { catchError, fromEvent, tap } from 'rxjs';
import { Socket } from 'socket.io';

export async function setHandleDisconnect(
	consumer: Consumer,
	client: Socket,
	logger: JsonLogger,
): Promise<void> {
	fromEvent(client, 'disconnect')
		.pipe(
			tap(async () => {
				await consumer.close();
			}),
			catchError((err) => {
				logger.error(err);
				throw err;
			}),
		)
		.subscribe();
	if (!client.connected) {
		await consumer.close();
	}
}
