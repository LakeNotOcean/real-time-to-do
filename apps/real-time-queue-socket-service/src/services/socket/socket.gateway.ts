import { JsonLogger } from '@common';
import { Inject, UseFilters } from '@nestjs/common';
import {
	OnGatewayConnection,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { ASYNC_RABBITMQ } from '@rabbitmq';
import { Server, Socket } from 'socket.io';
import { RabbitMQService } from '../rabbitMQ/rabbitMQ.service';
import { handleConnection } from './client-functions/handle-connection';
import { ErrorFilter, WsExceptionsFilter } from './exception.filter';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
	protected readonly logger = new JsonLogger(SocketGateway.name);

	@WebSocketServer()
	protected server: Server;

	constructor(
		@Inject(ASYNC_RABBITMQ)
		private readonly rabbitMQService: RabbitMQService,
	) {}

	@UseFilters(new WsExceptionsFilter(), new ErrorFilter())
	async handleConnection(client: Socket) {
		await handleConnection(client, this.rabbitMQService, this.logger);
	}
}
