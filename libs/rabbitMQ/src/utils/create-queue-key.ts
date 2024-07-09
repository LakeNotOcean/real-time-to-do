export function createQueueKey(userId: string, sessionId: string) {
	return `${userId}.${sessionId}`;
}
