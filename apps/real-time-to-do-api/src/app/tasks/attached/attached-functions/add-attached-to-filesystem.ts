import { File } from '@nest-lab/fastify-multer';
import { createHash } from 'crypto';
import { writeFile } from 'fs/promises';
import { getPathToAttached } from '../../../utils/path.utils';

// return md5 hash of file
export async function addAttachedFileToFilesystem(
	file: File,
	pathToStorage: string,
): Promise<string> {
	const fileHash = createHash('md5').update(file.buffer!).digest('hex');
	await writeFile(getPathToAttached(pathToStorage, fileHash), file.buffer!, {
		flag: 'w',
	});
	return fileHash;
}
