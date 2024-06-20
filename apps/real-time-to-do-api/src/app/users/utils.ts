import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { USER_NOT_EXISTS } from '../constants/not-exist-error-messages.constant';
import { NotExistException } from '../exceptions';

export async function checkUserExists(
	tx: Prisma.usersDelegate<DefaultArgs>,
	id: bigint,
) {
	const user = await tx.findFirst({
		select: { id: true },
		where: { id },
	});
	if (!user) {
		throw new NotExistException({ message: USER_NOT_EXISTS });
	}
}
