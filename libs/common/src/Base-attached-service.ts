import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { STORAGE_DIR_NAME } from './constants';
import { createDir } from './file-system-utils';
import { PrismaService } from './prisma-wrapper';

export abstract class BaseAttchedService {
	protected readonly pathToStorage: string;

	constructor(
		protected readonly prismaService: PrismaService,
		configService: ConfigService,
	) {
		this.pathToStorage = join(
			configService.getOrThrow<string>('storagePath'),
			STORAGE_DIR_NAME,
		);
		createDir(this.pathToStorage);
	}
}
