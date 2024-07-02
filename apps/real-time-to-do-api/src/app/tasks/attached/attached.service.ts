import { createEmptyResult, createSuccessResult, Result } from '@common';
import { File } from '@nest-lab/fastify-multer';
import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { STORAGE_DIR_NAME } from '../../constants/path.constant';
import { AttachedDto } from '../../dto/attached.dto';
import { PrismaService } from '../../prisma-wrapper/prisma.service';
import { addAttachedFile } from './attached-functions/add-attached-file';
import { getAttachedFile } from './attached-functions/get-attached-file';
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
		const attachedEntities = await getAttachInfoList(
			this.prismaService,
			taskId,
		);
		const dtoResult = attachedEntities.map(
			(a) =>
				new AttachedInfoDto({ id: a.id, name: a.file_name, taskId: a.task_id }),
		);
		return createSuccessResult(dtoResult);
	}

	async getAttached(attachedId: bigint): Promise<Result<AttachedDto>> {
		const { attached, fileStream } = await getAttachedFile(
			this.prismaService,
			this.pathToStorage,
			attachedId,
		);
		const resultDto = new AttachedDto({
			id: attached.id,
			name: attached.file_name,
			taskId: attached.task_id,
			fileStream: new StreamableFile(fileStream),
		});
		return createSuccessResult(resultDto);
	}

	async attach(taskId: bigint, file: File): Promise<Result<bigint>> {
		const id = await addAttachedFile(
			this.prismaService,
			taskId,
			this.pathToStorage,
			file,
		);

		return createSuccessResult(id);
	}

	async removeAttached(attachedId: bigint): Promise<Result<null>> {
		await removeAttached(this.prismaService, this.pathToStorage, attachedId);
		return createEmptyResult();
	}
}
