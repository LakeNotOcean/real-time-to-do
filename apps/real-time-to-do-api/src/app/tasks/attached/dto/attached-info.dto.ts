import { PickType } from '@nestjs/swagger';
import { AttachedDto } from '../../../dto/attached.dto';

export class AttachedInfoDto extends PickType(AttachedDto, [
	'id',
	'taskId',
	'name',
]) {
	constructor(args: Required<AttachedInfoDto>) {
		super();
		Object.assign(this, args);
	}
}
