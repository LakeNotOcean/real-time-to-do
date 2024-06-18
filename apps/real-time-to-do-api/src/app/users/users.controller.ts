import { BaseApiController } from '@common';
import { Body, Controller, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { IdQueryDec } from '../decorators/id-query.decorator';
import { DeleteRequestDec } from '../decorators/methods-decorators/delete-request.decorator';
import { GetRequestDec } from '../decorators/methods-decorators/get-request.decorator';
import { PatchRequestDec } from '../decorators/methods-decorators/patch-request.decorator';
import { PostRequestDec } from '../decorators/methods-decorators/post-request.decorator';
import { UserDto } from '../dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller()
@ApiTags('users')
export class UsersController extends BaseApiController {
	constructor(private readonly usersService: UsersService) {
		super();
	}

	@PostRequestDec({
		responseString: 'user is added',
		description: 'create user',
	})
	async create(
		@Body() createUserDto: CreateUserDto,
		@Res() response: FastifyReply,
	) {
		await this.usersService.create(createUserDto);
		this.Created(response);
	}

	@GetRequestDec({
		resultType: UserDto,
		isResultArray: true,
		route: 'all',
		description: 'get user list',
	})
	async findAll() {
		return (await this.usersService.findAll()).unwrap();
	}

	@GetRequestDec({ resultType: UserDto, description: 'get user' })
	async findOne(
		@IdQueryDec()
		id: bigint,
	) {
		return (await this.usersService.findOne(id)).unwrap();
	}

	@PatchRequestDec({ responseString: 'user name changed successfully' })
	async update(@IdQueryDec() id: bigint, @Body() updateUserDto: UpdateUserDto) {
		return (await this.usersService.update(id, updateUserDto)).unwrap();
	}

	@DeleteRequestDec({ responseString: 'user removed successfully' })
	async remove(@IdQueryDec() id: bigint) {
		return (await this.usersService.remove(id)).unwrap();
	}
}
