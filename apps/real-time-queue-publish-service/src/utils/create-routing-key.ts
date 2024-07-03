import { getKey } from '@common';

export function createRouingKey(taskId: string, userId: string) {
	return getKey(taskId, userId);
}
