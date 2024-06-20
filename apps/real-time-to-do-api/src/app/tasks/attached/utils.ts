import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { ATTACHED_NOT_EXISTS } from '../../constants/not-exist-error-messages.constant';
import { NotExistException } from '../../exceptions';

export async function checkAttachedExists(
	tx: Prisma.attachedDelegate<DefaultArgs>,
	id: bigint,
): Promise<void> {
	const attached = await tx.findFirst({ select: { id: true }, where: { id } });
	if (!attached) {
		throw new NotExistException({ message: ATTACHED_NOT_EXISTS });
	}
}
