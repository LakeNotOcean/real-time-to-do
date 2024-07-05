import { existsSync, mkdirSync } from 'fs';

export function createDir(pathToDir: string) {
	if (!existsSync(pathToDir)) {
		mkdirSync(pathToDir, { recursive: true });
	}
}
