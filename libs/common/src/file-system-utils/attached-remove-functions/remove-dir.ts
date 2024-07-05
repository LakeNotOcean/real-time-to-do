import { rm } from 'fs/promises';

export async function removeDir(pathToDir: string) {
	await rm(pathToDir, { recursive: true, force: true });
}
