import {
	createEmptyResult,
	createSuccessResult,
	Result,
	toTaskEnum,
} from '@common';
import { Injectable } from '@nestjs/common';
import { TaskDto } from '../dto/task.dto';
import { PrismaService } from '../prisma-wrapper/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(createTaskDto: CreateTaskDto) {
		await this.prismaService.tasks.create({ data: createTaskDto });
		return createEmptyResult();
	}

	async findAll() {
		const tasks = await this.prismaService.tasks.findMany({});
		const dtoResult = tasks.map(
			(t) =>
				new TaskDto({
					id: t.id,
					title: t.title,
					status: toTaskEnum(t.status).unwrap(),
					description: t.description,
					userId: t.user_id,
				}),
		);
		return createSuccessResult(dtoResult);
	}

	async findOne(id: bigint): Promise<Result<void> | Result<TaskDto>> {
		const task = await this.prismaService.tasks.findFirst({ where: { id } });
		if (!task) {
			return createEmptyResult();
		}
		const dtoResult = new TaskDto({
			id: task.id,
			title: task.title,
			status: toTaskEnum(task.status).unwrap(),
			description: task.description,
			userId: task.user_id,
		});
		return createSuccessResult(dtoResult);
	}

	async update(id: bigint, updateTaskDto: UpdateTaskDto) {
		await this.prismaService.users.update({
			where: { id },
			data: {
				...(updateTaskDto.description
					? { description: updateTaskDto.description }
					: {}),
				...(updateTaskDto.status ? { status: updateTaskDto.status } : {}),
				...(updateTaskDto.title ? { title: updateTaskDto.title } : {}),
			},
		});
		return createEmptyResult();
	}

	async remove(id: bigint) {
		await this.prismaService.tasks.delete({ where: { id } });
		return createEmptyResult();
	}
}
