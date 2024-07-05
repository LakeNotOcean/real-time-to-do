export class UserToken {
	constructor(args: Required<UserToken>) {
		Object.assign(this, args);
	}
	userId: string;
	sessionId: string;
}
