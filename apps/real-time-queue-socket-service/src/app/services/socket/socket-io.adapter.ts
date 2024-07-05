import { JsonLogger } from '@common';
import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
	private readonly logger = new JsonLogger(SocketIoAdapter.name);
	constructor(
		private app: INestApplicationContext,
		private configService: ConfigService,
	) {
		super(app);
	}

	createIOServer(port: number, options: ServerOptions) {
		port = Number(this.configService.getOrThrow<number>('socketPort'));
		const prefix = this.configService.getOrThrow<string>('socketPrefix');
		options.path = '/' + prefix;
		const server = super.createIOServer(port, {
			...options,
			cors: true,
			pingTimeout: 10000,
			pingInterval: 10000,
		});
		this.logger.log(`socket created on port ${port} with path ${options.path}`);
		return server;
	}
}
