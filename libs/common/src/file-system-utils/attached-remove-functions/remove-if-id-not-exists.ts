import { readdirSync } from 'fs';
import { rm } from 'fs/promises';
import { join } from 'path';

export async function removeIfIdNotExists(
	selectIdFunction: (id: bigint) => Promise<bigint | null>,
	pathToDir: string,
) {
	const elementsList = readdirSync(pathToDir);
	for await (const element of elementsList) {
		const id = await selectIdFunction(BigInt(element));
		if (!id) {
			await rm(join(pathToDir, element), {
				force: true,
			});
		}
	}
}
