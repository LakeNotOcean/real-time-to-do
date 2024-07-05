import { PrismaService } from '@common';
import { createReadStream } from 'fs';
import { ATTACHED_NOT_EXISTS } from '../../../constants/not-exist-error-messages.constant';
import { AttachedEntity } from '../../../entities/Attached.entity';
import { NotExistException } from '../../../exceptions';
import { getPathToAttached } from '../../../utils/path.utils';
import { AttachedWithUserId } from '../../types/attached-with-user-id';
import { AttachedStreamDto } from '../dto/attached-stream.dto';
import { checkAttachedExists } from '../utils';

// Return the readStream of file and database entity
export async function getAttachedFile(
	prismaService: PrismaService,
	pathToStorage: string,
	attachedId: bigint,
): Promise<AttachedStreamDto> {
	const res = await prismaService.$transaction(async (tx) => {
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
		return { attached, userId } as AttachedWithUserId;
	});

	const attached: AttachedEntity = res.attached;

	const fileStream = createReadStream(
		getPathToAttached(
			pathToStorage,
			res.userId,
			attached.task_id,
			attached.file_hash,
		),
	);
	return new AttachedStreamDto({ fileStream, mimetype: attached.file_type });
}
