import { toMilliseconds } from '@common';
import { AsyncMessage } from 'rabbitmq-client';
import { Socket } from 'socket.io';
import { TASK_CHANGE_CHANNEL } from '../../constants';

export function getConsumerHandler(client: Socket) {
	return async (msg: AsyncMessage) => {
		await client
			.timeout(toMilliseconds('15s'))
			.emitWithAck(TASK_CHANGE_CHANNEL, msg.body);
	};
}
