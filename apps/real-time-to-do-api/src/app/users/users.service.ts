import {
	BaseAttchedService,
	createEmptyResult,
	createSuccessResult,
	PrismaService,
	removeDir,
	Result,
} from '@common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { USER_NOT_EXISTS } from '../constants/not-exist-error-messages.constant';
import { UserDto } from '../dto/user.dto';
import { NotExistException } from '../exceptions';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { checkUserExists } from './utils';

@Injectable()
export class UsersService extends BaseAttchedService {
	constructor(prismaService: PrismaService, configService: ConfigService) {
		super(prismaService, configService);
	}

	async create(createUserDto: CreateUserDto): Promise<Result<bigint>> {
		const user = await this.prismaService.users.create({ data: createUserDto });
		return createSuccessResult(user.id);
	}

	async findAll(): Promise<Result<UserDto[]>> {
		const users = await this.prismaService.users.findMany({});
		const dtoResult = users.map((u) => new UserDto({ id: u.id, name: u.name }));
		return createSuccessResult(dtoResult);
	}

	async findOne(id: bigint): Promise<Result<UserDto>> {
		const user = await this.prismaService.users.findFirst({
			where: { id },
		});
		if (!user) {
			throw new NotExistException({ message: USER_NOT_EXISTS });
		}
		const dtoResult = new UserDto({ id: user.id, name: user.name });
		return createSuccessResult(dtoResult);
	}

	async update(
		id: bigint,
		updateUserDto: UpdateUserDto,
	): Promise<Result<null>> {
		await this.prismaService.$transaction(async (tx) => {
			await checkUserExists(tx.users, id);
			await tx.users.update({
				where: { id },
				data: updateUserDto.name ? { name: updateUserDto.name } : {},
			});
		});
		return createEmptyResult();
	}

	async remove(id: bigint): Promise<Result<null>> {
		await this.prismaService.$transaction(async (tx) => {
			await checkUserExists(tx.users, id);
			await tx.users.delete({ where: { id } });
		});
		await removeDir(join(this.pathToStorage, id.toString()));
		return createEmptyResult();
	}
}
