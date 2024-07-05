import { PrismaService } from '../../prisma-wrapper';
import { removeIfIdNotExists } from './remove-if-id-not-exists';

export async function removedUnusedUsersDirs(
	prismaService: PrismaService,
	pathToDir: string,
) {
	await removeIfIdNotExists(async (id: bigint) => {
		const foundId = await prismaService.users.findFirst({
			select: { id: true },
			where: { id: BigInt(id) },
		});
		return foundId?.id || null;
	}, pathToDir);
}
