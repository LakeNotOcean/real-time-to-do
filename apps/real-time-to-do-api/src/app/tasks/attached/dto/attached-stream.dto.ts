import { ReadStream } from 'fs';

export class AttachedStreamDto {
	constructor(args: Required<AttachedStreamDto>) {
		Object.assign(this, args);
	}
	mimetype: string;
	fileStream: ReadStream;
}
