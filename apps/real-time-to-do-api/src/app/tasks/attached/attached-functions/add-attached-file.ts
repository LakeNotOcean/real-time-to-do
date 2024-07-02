import { File } from '@nest-lab/fastify-multer';
import { PrismaService } from '../../../prisma-wrapper/prisma.service';
import { checkTaskExists } from '../../utils';
import { addAttachedFileToFilesystem } from './add-attached-to-filesystem';

export async function addAttachedFile(
	prismaService: PrismaService,
	taskId: bigint,
	pathToStorage: string,
	file: File,
): Promise<bigint> {
	await checkTaskExists(prismaService.tasks, taskId);

	const fileHash = await addAttachedFileToFilesystem(file, pathToStorage);

	const id = await prismaService.$transaction(async (tx) => {
		await checkTaskExists(tx.tasks, taskId);
		const attached = await tx.attached.create({
			data: {
				task_id: taskId,
				file_hash: fileHash,
				file_name: file.originalname,
				file_type: file.mimetype,
			},
		});
		return attached.id;
	});
	return id;
}
