import { PartialType, PickType } from '@nestjs/swagger';
import { UserDto } from '../../dto/user.dto';

export class UpdateUserDto extends PartialType(
	PickType<UserDto, keyof UserDto>(UserDto, ['name'] as const),
) {}
