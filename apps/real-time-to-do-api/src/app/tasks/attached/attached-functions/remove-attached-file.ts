import { PrismaService } from '@common';
import { ATTACHED_NOT_EXISTS } from '../../../constants/not-exist-error-messages.constant';
import { NotExistException } from '../../../exceptions';
import { AttachedWithUserId } from '../../types/attached-with-user-id';
import { checkAttachedExists } from '../utils';
import { removeAttachedFromFilesystem } from './remove-attached-from-filesystem';

export async function removeAttached(
	prismaService: PrismaService,
	pathToStorage: string,
	attachedId: bigint,
): Promise<void> {
	const attachedWithUserId = await prismaService.$transaction(async (tx) => {
		await checkAttachedExists(tx.attached, attachedId);
		const attached = await tx.attached.findFirst({
			where: { id: attachedId },
		});
		if (!attached) {
			throw new NotExistException({ message: ATTACHED_NOT_EXISTS });
		}
		const userId = (await tx.tasks.findFirst({
			select: { user_id: true },
			where: { id: attached.task_id },
		}))!.user_id;

		await tx.attached.delete({ where: { id: attached?.id } });
		return { attached, userId } as AttachedWithUserId;
	});

	await removeAttachedFromFilesystem(
		pathToStorage,
		attachedWithUserId.userId,
		attachedWithUserId.attached.task_id,
		attachedWithUserId.attached.file_hash,
	);
}
