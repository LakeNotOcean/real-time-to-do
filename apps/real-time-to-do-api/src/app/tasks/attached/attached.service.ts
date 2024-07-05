import {
	BaseAttchedService,
	createEmptyResult,
	createSuccessResult,
	PrismaService,
	Result,
} from '@common';
import { File } from '@nest-lab/fastify-multer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { addAttachedFile } from './attached-functions/add-attached-file';
import { getAttachedFile } from './attached-functions/get-attached-file';
import { getAttachInfoList } from './attached-functions/get-attached-info-list';
import { removeAttached } from './attached-functions/remove-attached-file';
import { AttachedInfoDto } from './dto/attached-info.dto';
import { AttachedStreamDto } from './dto/attached-stream.dto';

@Injectable()
export class AttachedService extends BaseAttchedService {
	constructor(prismaService: PrismaService, configService: ConfigService) {
		super(prismaService, configService);
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

	async getAttached(attachedId: bigint): Promise<Result<AttachedStreamDto>> {
		const attachedDto = await getAttachedFile(
			this.prismaService,
			this.pathToStorage,
			attachedId,
		);

		return createSuccessResult(attachedDto);
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
