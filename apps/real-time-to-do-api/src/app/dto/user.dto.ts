import { IntersectionType } from '@nestjs/swagger';
import { IdDto } from './id.dto';
import { NameDto } from './name.dto';

export class UserDto extends IntersectionType(IdDto, NameDto) {
	constructor(args: Required<UserDto>) {
		super();
		Object.assign(this, args);
	}
}
