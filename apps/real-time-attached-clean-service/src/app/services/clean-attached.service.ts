import { JsonLogger, PrismaService, STORAGE_DIR_NAME } from '@common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class CleanAttachedService {
	private readonly logger = new JsonLogger(CleanAttachedService.name);

	private pathToStorage: string;

	constructor(
		private readonly prismaService: PrismaService,
		private readonly schedulerRegistry: SchedulerRegistry,
		configService: ConfigService,
	) {
		this.pathToStorage = join(
			configService.getOrThrow<string>('storagePath'),
			STORAGE_DIR_NAME,
		);
		if (!existsSync(this.pathToStorage)) {
			mkdirSync(this.pathToStorage, { recursive: true });
		}
	}
}
