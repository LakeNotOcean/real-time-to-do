import { AsyncMessage } from 'rabbitmq-client';
import { Socket } from 'socket.io';
import { TASK_CHANGE_CHANNEL } from '../../constants';

export function getConsumerHandler(client: Socket, socketTimeOut: number) {
	return async (msg: AsyncMessage) => {
		await client
			.timeout(socketTimeOut)
			.emitWithAck(TASK_CHANGE_CHANNEL, msg.body);
	};
}
