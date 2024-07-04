import { Socket } from 'socket.io';
import { UserToken } from '../dto/user-token.dto';

export function getUserTokenFromClient(client: Socket): UserToken | null {
	const userId = client.handshake.headers.user_id;
	const sessionId = client.handshake.headers.session_id;
	if (typeof userId != 'string' || typeof sessionId != 'string') {
		return null;
	}
	return new UserToken({ userId, sessionId });
}
