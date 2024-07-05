import { PrismaService, removeUnusedSubdirs } from '@common';

export async function cleanUnusedDirs(
	prismaService: PrismaService,
	pathToStorage: string,
) {
	await removeUnusedSubdirs(prismaService, pathToStorage);
}
