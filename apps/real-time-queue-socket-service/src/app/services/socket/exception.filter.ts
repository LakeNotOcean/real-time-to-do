import { JsonLogger } from '@common';
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CLIENT_ERROR_CHANNEL } from '../../constants';

@Catch(WsException, HttpException)
export class WsExceptionsFilter extends BaseWsExceptionFilter {
	private readonly logger = new JsonLogger(WsExceptionsFilter.name);

	catch(exception: WsException | HttpException, host: ArgumentsHost) {
		const client = host.switchToWs().getClient() as Socket;
		const data = host.switchToWs().getData();
		const error =
			exception instanceof WsException
				? exception.getError()
				: exception.getResponse();
		const details = error instanceof Object ? { ...error } : { message: error };
		const errorMessage = JSON.stringify({
			event: 'error',
			data: {
				id: (client as any).id,
				rid: data,
				...details,
			},
		});
		this.logger.log(errorMessage);
		client.emit(CLIENT_ERROR_CHANNEL, errorMessage);
	}
}

@Catch()
export class ErrorFilter extends BaseWsExceptionFilter {
	private readonly logger = new JsonLogger(ErrorFilter.name);

	catch(exception: Error, host: ArgumentsHost): void {
		const client = host.switchToWs().getClient() as Socket;
		const errorMessage = JSON.stringify({
			name: exception.name,
			message: exception.message,
			stack: exception?.stack,
		});
		client.send(errorMessage);
		this.logger.error(errorMessage);
	}
}
