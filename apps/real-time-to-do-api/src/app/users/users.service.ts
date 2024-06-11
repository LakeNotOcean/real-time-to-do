import { createEmptyResult, createSuccessResult, Result } from '@common';
import { Injectable } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { NotExistException } from '../exceptions';
import { PrismaService } from '../prisma-wrapper/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(createUserDto: CreateUserDto): Promise<Result<void>> {
		await this.prismaService.users.create({ data: createUserDto });
		return createEmptyResult();
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
		const dtoResult = new UserDto({ id: user.id, name: user.name });
		return createSuccessResult(dtoResult);
	}

	async update(
		id: bigint,
		updateUserDto: UpdateUserDto,
	): Promise<Result<void>> {
		await this.prismaService.$transaction(async (tx) => {
			const { id } = await tx.users.findFirst({
				select: { id: true },
				where: { id: updateUserDto.id },
			});
			if (!id) {
				throw new NotExistException({ message: 'task does not exist' });
			}
			await tx.users.update({
				where: { id },
				data: updateUserDto.name ? { name: updateUserDto.name } : {},
			});
		});
		await this.prismaService.users.update({
			where: { id },
			data: updateUserDto.name ? { name: updateUserDto.name } : {},
		});
		return createEmptyResult();
	}

	async remove(id: bigint): Promise<Result<void>> {
		await this.prismaService.users.delete({ where: { id } });
		return createEmptyResult();
	}
}
