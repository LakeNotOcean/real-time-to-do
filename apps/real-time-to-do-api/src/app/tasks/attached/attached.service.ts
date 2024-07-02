import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { createEmptyResult, createSuccessResult, Result } from '@common';
import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ATTACHED_NOT_EXISTS } from '../../constants/not-exist-error-messages.constant';
import { STORAGE_DIR_NAME } from '../../constants/path.constant';
import { AttachedDto } from '../../dto/attached.dto';
import { NotExistException } from '../../exceptions';
import { PrismaService } from '../../prisma-wrapper/prisma.service';
import { getPathToAttached } from '../../utils/path.utils';
import { checkTaskExists } from '../utils';
import { getAttachInfoList } from './attached-functions/get-attached-info-list';
import { removeAttached } from './attached-functions/remove-attached-file';
import { AttachedInfoDto } from './dto/attached-info.dto';

@Injectable()
export class AttachedService {
	private readonly pathToStorage: string;

	constructor(
		private readonly prismaService: PrismaService,
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

	async getAttachInfoList(taskId: bigint): Promise<Result<AttachedInfoDto[]>> {
		const dtoResult = await getAttachInfoList(this.prismaService, taskId);
		return createSuccessResult(dtoResult);
	}

	async getAttached(attachedId: bigint): Promise<Result<AttachedDto>> {
		const attached = await this.prismaService.attached.findFirst({
			where: { id: attachedId },
		});
		if (!attached) {
			throw new NotExistException({ message: ATTACHED_NOT_EXISTS });
		}
		const file = createReadStream(
			getPathToAttached(
				this.pathToStorage,
				attached.file_hash,
				attached.file_type,
			),
		);
		const resultDto = new AttachedDto({
			id: attached.id,
			name: attached.file_name,
			taskId: attached.task_id,
			file: new StreamableFile(file),
		});
		return createSuccessResult(resultDto);
	}

	async attach(taskId: bigint, file: MemoryStorageFile): Promise<Result<null>> {
		await checkTaskExists(this.prismaService.tasks, taskId);

		const fileHash = createHash('md5').update(file.buffer).digest('hex');
		await new Promise<void>(function (resolve, reject) {
			const writeStream = createWriteStream(
				getPathToAttached(this.pathToStorage, fileHash, file.mimetype),
				{ flags: 'w' },
			);
			writeStream.write(file.buffer);
			writeStream.on('end', () => resolve());
			writeStream.on('error', (err) => reject(err));
		});

		return createEmptyResult();
	}

	async removeAttached(attachedId: bigint): Promise<Result<null>> {
		await removeAttached(this.prismaService, this.pathToStorage, attachedId);
		return createEmptyResult();
	}
}
