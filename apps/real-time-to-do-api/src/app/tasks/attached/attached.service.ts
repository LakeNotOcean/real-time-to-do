import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { createEmptyResult, createSuccessResult, Result } from '@common';
import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import { rm } from 'fs/promises';
import { join } from 'path';
import { STORAGE_DIR_NAME } from '../../constants/path.constant';
import { AttachedDto } from '../../dto/attached.dto';
import { NotExistException } from '../../exceptions';
import { PrismaService } from '../../prisma-wrapper/prisma.service';
import { getPathToAttached } from '../../utils/path.utils';
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

	async getAttachList(taskId: bigint): Promise<Result<AttachedInfoDto[]>> {
		const attached = await this.prismaService.attached.findMany({
			where: { task_id: taskId },
		});
		const dtoResult = attached.map(
			(a) => new AttachedInfoDto({ id: a.id, name: a.name, taskId: a.task_id }),
		);
		return createSuccessResult(dtoResult);
	}

	async getAttached(attachedId: bigint): Promise<Result<AttachedDto>> {
		const attached = await this.prismaService.attached.findFirst({
			where: { id: attachedId },
		});
		const file = createReadStream(
			getPathToAttached(this.pathToStorage, attached.id),
		);
		const resultDto = new AttachedDto({
			id: attached.id,
			name: attached.name,
			taskId: attached.task_id,
			file: new StreamableFile(file),
		});
		return createSuccessResult(resultDto);
	}

	async attach(taskId: bigint, file: MemoryStorageFile): Promise<Result<void>> {
		await this.prismaService.$transaction(async (tx) => {
			const foundTask = await tx.tasks.findFirst({
				select: { id: true },
				where: { id: taskId },
			});
			if (!foundTask.id) {
				throw new NotExistException({ message: 'task not found' });
			}
			const { id } = await tx.attached.create({
				data: { name: file.fieldname },
			});

			await new Promise<void>(function (resolve, reject) {
				const writeStream = createWriteStream(
					getPathToAttached(this.pathToStorage, id),
				);
				writeStream.write(file.buffer);
				writeStream.on('end', () => resolve());
				writeStream.on('error', (err) => reject(err));
			});
		});
		return createEmptyResult();
	}

	async removeAttached(attachedId: bigint): Promise<Result<void>> {
		await this.prismaService.$transaction(async (tx) => {
			const foundAttached = await tx.attached.findFirst({
				select: { id: true },
				where: { id: attachedId },
			});
			if (!foundAttached.id) {
				throw new NotExistException({ message: 'attached not found' });
			}
			await rm(getPathToAttached(this.pathToStorage, foundAttached.id), {
				force: true,
			});
			await tx.attached.delete({ where: { id: foundAttached.id } });
		});
		return createEmptyResult();
	}
}
