import { createDir } from '@common';
import { File } from '@nest-lab/fastify-multer';
import { createHash } from 'crypto';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getPathToAttached } from '../../../utils/path.utils';

// return md5 hash of file
export async function addAttachedFileToFilesystem(
	file: File,
	pathToStorage: string,
	userId: bigint,
	taskId: bigint,
): Promise<string> {
	const taskDir = join(pathToStorage, userId.toString());
	createDir(taskDir);
	const fileDir = join(pathToStorage, userId.toString(), taskId.toString());
	createDir(fileDir);

	const fileHash = createHash('md5').update(file.buffer!).digest('hex');
	await writeFile(
		getPathToAttached(pathToStorage, userId, taskId, fileHash),
		file.buffer!,
		{
			flag: 'w',
		},
	);
	return fileHash;
}
