import { createReadStream } from 'fs';
import { ATTACHED_NOT_EXISTS } from '../../../constants/not-exist-error-messages.constant';
import { AttachedEntity } from '../../../entities/Attached.entity';
import { NotExistException } from '../../../exceptions';
import { PrismaService } from '../../../prisma-wrapper/prisma.service';
import { getPathToAttached } from '../../../utils/path.utils';
import { AttachedStreamDto } from '../dto/attached-stream.dto';
import { checkAttachedExists } from '../utils';

// Return the readStream of file and database entity
export async function getAttachedFile(
	prismaService: PrismaService,
	pathToStorage: string,
	attachedId: bigint,
): Promise<AttachedStreamDto> {
	const attached: AttachedEntity = await prismaService.$transaction(
		async (tx) => {
			await checkAttachedExists(tx.attached, attachedId);
			const attached = await tx.attached.findFirst({
				where: { id: attachedId },
			});
			return attached!;
		},
	);
	if (!attached) {
		throw new NotExistException({ message: ATTACHED_NOT_EXISTS });
	}
	const fileStream = createReadStream(
		getPathToAttached(pathToStorage, attached.file_hash),
	);
	return new AttachedStreamDto({ fileStream, mimetype: attached.file_type });
}
