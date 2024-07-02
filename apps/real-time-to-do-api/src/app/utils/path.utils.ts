import { join } from 'path';

export function getPathToAttached(
	pathToStorage: string,
	fileHash: string,
	fileType: string,
) {
	return join(process.cwd(), pathToStorage, fileHash + '.' + fileType);
}
