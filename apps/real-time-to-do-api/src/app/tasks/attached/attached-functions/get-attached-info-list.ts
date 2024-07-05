import { PrismaService } from '@common';
import { AttachedEntity } from '../../../entities/Attached.entity';
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
