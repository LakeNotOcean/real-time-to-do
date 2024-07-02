import { rm } from 'fs/promises';
import { AttachedEntity } from '../../../entities/Attached.entity';
import { getPathToAttached } from '../../../utils/path.utils';

export async function removeAttachedListFromFilesystem(
	pathToStorage: string,
	attachedList: AttachedEntity[],
) {
	for await (const attached of attachedList) {
		await removeAttachedFromFilesystem(
			pathToStorage,
			attached.file_hash,
			attached.file_type,
		);
	}
}

export async function removeAttachedFromFilesystem(
	pathToStorage: string,
	fileHash: string,
	fileType: string,
) {
	await rm(getPathToAttached(pathToStorage, fileHash, fileType), {
		force: true,
	});
}
