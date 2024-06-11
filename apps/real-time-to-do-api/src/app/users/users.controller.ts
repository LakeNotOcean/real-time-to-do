import { BaseApiController } from '@common';
import { Body, Controller, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { DeleteRequestDec } from '../decorators/methods-decorators/delete-request.decorator';
import { GetRequestDec } from '../decorators/methods-decorators/get-request.decorator';
import { PatchRequestDec } from '../decorators/methods-decorators/patch-request.decorator';
import { PostRequestDec } from '../decorators/methods-decorators/post-request.decorator';
import { UserDto } from '../dto/user.dto';
import { IdQueryReqParam } from '../queries/id.query';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
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
	async findOne(@Query('id') { id }: IdQueryReqParam) {
		return (await this.usersService.findOne(id)).unwrap();
	}

	@PatchRequestDec({ responseString: 'user name changed successfully' })
	async update(
		@Query('id') { id }: IdQueryReqParam,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return await this.usersService.update(id, updateUserDto);
	}

	@DeleteRequestDec({ responseString: 'user removed successfully' })
	async remove(@Query('id') { id }: IdQueryReqParam) {
		return this.usersService.remove(id);
	}
}
