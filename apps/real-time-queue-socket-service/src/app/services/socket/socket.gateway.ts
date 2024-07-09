import { JsonLogger, toMilliseconds } from '@common';
import { Inject, UseFilters } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
	protected readonly socketTimeout: number;

	@WebSocketServer()
	protected server: Server;

	constructor(
		@Inject(ASYNC_RABBITMQ)
		private readonly rabbitMQService: RabbitMQService,
		configService: ConfigService,
	) {
		this.socketTimeout = toMilliseconds(
			configService.getOrThrow<string>('socketTimeout'),
		);
	}

	@UseFilters(new WsExceptionsFilter(), new ErrorFilter())
	async handleConnection(client: Socket) {
		await handleConnection(
			client,
			this.rabbitMQService,
			this.socketTimeout,
			this.logger,
		);
	}
}
