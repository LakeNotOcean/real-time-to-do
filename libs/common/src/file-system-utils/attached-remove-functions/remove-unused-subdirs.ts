import { readdirSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../../prisma-wrapper';
import { removedUnusedTasksDirs } from './remove-unused-tasks-dirs';
import { removedUnusedUsersDirs } from './remove-unused-users-dirs';

export async function removeUnusedSubdirs(
	prismaService: PrismaService,
	pathToStorage: string,
) {
	await removedUnusedUsersDirs(prismaService, pathToStorage);
	const usersDir = readdirSync(pathToStorage);
	for await (const userDir of usersDir) {
		await removedUnusedTasksDirs(prismaService, join(pathToStorage, userDir));
	}
}
