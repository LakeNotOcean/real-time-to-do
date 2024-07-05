import { rm } from 'fs/promises';
import { AttachedEntity } from '../../../entities/Attached.entity';
import { getPathToAttached } from '../../../utils/path.utils';

export async function removeAttachedListFromFilesystem(
	pathToStorage: string,
	userId: bigint,
	taskId: bigint,
	attachedList: AttachedEntity[],
) {
	for await (const attached of attachedList) {
		await removeAttachedFromFilesystem(
			pathToStorage,
			userId,
			taskId,
			attached.file_hash,
		);
	}
}

export async function removeAttachedFromFilesystem(
	pathToStorage: string,
	userId: bigint,
	taskId: bigint,
	fileHash: string,
) {
	await rm(getPathToAttached(pathToStorage, userId, taskId, fileHash), {
		force: true,
	});
}
