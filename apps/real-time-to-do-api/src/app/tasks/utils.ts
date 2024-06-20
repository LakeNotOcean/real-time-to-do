import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { TASK_NOT_EXISTS } from '../constants/not-exist-error-messages.constant';
import { NotExistException } from '../exceptions';

export async function checkTaskExists(
	tx: Prisma.tasksDelegate<DefaultArgs>,
	id: bigint,
): Promise<void> {
	const task = await tx.findFirst({ select: { id: true }, where: { id } });
	if (!task) {
		throw new NotExistException({ message: TASK_NOT_EXISTS });
	}
}
