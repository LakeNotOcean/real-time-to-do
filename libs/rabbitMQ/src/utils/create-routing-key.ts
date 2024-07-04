export function createRoutingKey(userId: string) {
	return `${userId}*`;
}
