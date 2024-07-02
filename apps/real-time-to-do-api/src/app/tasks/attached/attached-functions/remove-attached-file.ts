import { PrismaService } from '../../../prisma-wrapper/prisma.service';
import { checkAttachedExists } from '../utils';
import { removeAttachedFromFilesystem } from './remove-attached-from-filesystem';

export async function removeAttached(
	prismaService: PrismaService,
	pathToStorage: string,
	attachedId: bigint,
): Promise<void> {
	const attached = await prismaService.$transaction(async (tx) => {
		await checkAttachedExists(tx.attached, attachedId);
		const attached = await tx.attached.findFirst({
			where: { id: attachedId },
		});
		await tx.attached.delete({ where: { id: attached?.id } });
		return attached!;
	});

	await removeAttachedFromFilesystem(pathToStorage, attached.file_hash);
}
