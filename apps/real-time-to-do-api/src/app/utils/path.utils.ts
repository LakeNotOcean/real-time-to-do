import { join } from 'path';

export function getPathToAttached(pathToStorage: string, attachedId: bigint) {
	return join(process.cwd(), pathToStorage, attachedId.toString());
}
