import { BaseApiController } from '@common';
import { Body, Controller, Query, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { GetRequestDec } from '../decorators/methods-decorators/get-request.decorator';
import { PatchRequestDec } from '../decorators/methods-decorators/patch-request.decorator';
import { PostRequestDec } from '../decorators/methods-decorators/post-request.decorator';
import { UserDto } from '../dto/user.dto';
import { IdQueryParam } from '../queries/id.query';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController extends BaseApiController {
	constructor(private readonly usersService: UsersService) {
		super();
	}

	@PostRequestDec({ responseString: 'user is added' })
	async create(
		@Body() createUserDto: CreateUserDto,
		@Res() response: FastifyReply,
	) {
		await this.usersService.create(createUserDto);
		this.Created(response);
	}

	@GetRequestDec({ resultType: UserDto })
	async findAll() {
		return (await this.usersService.findAll()).unwrap();
	}

	@GetRequestDec({ resultType: UserDto })
	async findOne(@Query('id') { id }: IdQueryParam) {
		return (await this.usersService.findOne(id)).unwrap();
	}

	@PatchRequestDec({ responseString: 'user name changed successfully' })
	async update(
		@Query('id') { id }: IdQueryParam,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return await this.usersService.update(id, updateUserDto);
	}

	@PatchRequestDec({ responseString: 'user removed successfully' })
	async remove(@Query('id') { id }: IdQueryParam) {
		return this.usersService.remove(id);
	}
}
