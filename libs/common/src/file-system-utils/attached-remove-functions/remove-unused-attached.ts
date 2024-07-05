import { readdirSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../../prisma-wrapper';
import { removeIfIdNotExists } from './remove-if-id-not-exists';

export async function removeUnusedAttached(
	prismaService: PrismaService,
	pathToStorage: string,
) {
	const getAttachedIdFunc = async (id: bigint) => {
		const foundId = await prismaService.attached.findFirst({
			select: { id: true },
			where: { id: BigInt(id) },
		});
		return foundId?.id || null;
	};

	const usersDirs = readdirSync(pathToStorage);

	for await (const userDir of usersDirs) {
		const userDirPath = join(pathToStorage, userDir);
		const tasksDirs = readdirSync(userDirPath);

		for await (const taskDir of tasksDirs) {
			const taskDirPath = join(userDirPath, taskDir);
			const attachedList = readdirSync(taskDirPath);

			for await (const attached of attachedList) {
				await removeIfIdNotExists(getAttachedIdFunc, attached);
			}
		}
	}
}
