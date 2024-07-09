import { JsonLogger } from '@common';
import { createQueueKey, createRoutingKey } from '@rabbitmq';
import { Socket } from 'socket.io';
import { getConsumerHandler } from '../../common/consumer-handler';
import { initConsumer } from '../../rabbitMQ/init-consumer';
import { RabbitMQService } from '../../rabbitMQ/rabbitMQ.service';
import { sendNotAuthResponse } from './client-response';
import { getUserTokenFromClient } from './get-user-id-from-client';
import { setHandleDisconnect } from './handle-disconnect';

export async function handleConnection(
	client: Socket,
	rabbitMQService: RabbitMQService,
	socketTimeout: number,
	logger: JsonLogger,
) {
	const userToken = getUserTokenFromClient(client);
	if (!userToken) {
		sendNotAuthResponse(client);
		client.disconnect(true);
		return;
	}
	const queueKey = createQueueKey(userToken.userId, userToken.sessionId);
	const consumer = await initConsumer(
		rabbitMQService,
		queueKey,
		createRoutingKey(userToken.userId),
		getConsumerHandler(client, socketTimeout),
		(err: object) => {
			logger.error(err);
			client.disconnect(true);
		},
	);
	await setHandleDisconnect(consumer, client, logger);
}
