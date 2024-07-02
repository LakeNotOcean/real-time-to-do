import { PrismaService } from '../../../prisma-wrapper/prisma.service';
import { checkTaskExists } from '../../utils';
import { AttachedInfoDto } from '../dto/attached-info.dto';

export async function getAttachInfoList(
	prismaService: PrismaService,
	taskId: bigint,
): Promise<AttachedInfoDto[]> {
	const attached = await prismaService.$transaction(async (tx) => {
		await checkTaskExists(tx.tasks, taskId);

		const attached = await tx.attached.findMany({
			where: { task_id: taskId },
		});
		return attached;
	});
	return attached.map(
		(a) =>
			new AttachedInfoDto({ id: a.id, name: a.file_name, taskId: a.task_id }),
	);
}
