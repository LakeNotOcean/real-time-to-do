import { PrismaService, removeUnusedAttached } from '@common';

export async function cleanUnusedAttached(
	prismaService: PrismaService,
	pathToStorage: string,
) {
	await removeUnusedAttached(prismaService, pathToStorage);
}
