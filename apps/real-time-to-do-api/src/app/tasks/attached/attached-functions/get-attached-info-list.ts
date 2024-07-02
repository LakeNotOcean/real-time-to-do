import { AttachedEntity } from '../../../entities/Attached.entity';
import { PrismaService } from '../../../prisma-wrapper/prisma.service';
import { checkTaskExists } from '../../utils';

export async function getAttachInfoList(
	prismaService: PrismaService,
	taskId: bigint,
): Promise<AttachedEntity[]> {
	const attached = await prismaService.$transaction(async (tx) => {
		await checkTaskExists(tx.tasks, taskId);

		const attached = await tx.attached.findMany({
			where: { task_id: taskId },
		});
		return attached;
	});
	return attached;
}
