import { readdirSync } from 'fs';
import { join } from 'path';
import { removeDir } from './remove-dir';

export async function removeIfIdNotExists(
	selectIdFunction: (id: bigint) => Promise<bigint | null>,
	pathToDir: string,
) {
	const elementsList = readdirSync(pathToDir);
	for await (const element of elementsList) {
		const id = await selectIdFunction(BigInt(element));
		if (!id) {
			await removeDir(join(pathToDir, element));
		}
	}
}
