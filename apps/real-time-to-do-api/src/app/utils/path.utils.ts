import { join } from 'path';

export function getPathToAttached(
	pathToStorage: string,
	userId: bigint,
	taskId: bigint,
	fileHash: string,
) {
	return join(
		process.cwd(),
		pathToStorage,
		userId.toString(),
		taskId.toString(),
		fileHash,
	);
}
