import { CLIENT_ERROR_CHANNEL } from 'apps/real-time-queue-socket-service/src/app/constants';
import { Socket } from 'socket.io';
import { ResultDto } from '../dto/result.dto';

export function sendNotAuthResponse(client: Socket) {
	client.emit(
		CLIENT_ERROR_CHANNEL,
		new ResultDto(-1, false, 'user is not defined'),
	);
}
