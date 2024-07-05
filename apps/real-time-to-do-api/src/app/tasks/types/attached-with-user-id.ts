import { AttachedEntity } from '../../entities/Attached.entity';

export type AttachedWithUserId = {
	attached: AttachedEntity;
	userId: bigint;
};
