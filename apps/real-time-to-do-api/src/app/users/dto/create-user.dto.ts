import { PickType } from '@nestjs/swagger';
import { UserDto } from '../../dto/user.dto';

export class CreateUserDto extends PickType(UserDto, ['name']) {}
