import {
	createEmptyResult,
	createSuccessResult,
	Result,
	toTaskEnum,
} from '@common';
import { Injectable } from '@nestjs/common';
import { TASK_NOT_EXISTS } from '../constants/not-exist-error-messages.constant';
import { TaskDto } from '../dto/task.dto';
import { NotExistException } from '../exceptions';
import { PrismaService } from '../prisma-wrapper/prisma.service';
import { checkUserExists } from '../users/utils';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { checkTaskExists } from './utils';

@Injectable()
export class TasksService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(createTaskDto: CreateTaskDto) {
		await this.prismaService.$transaction(async (tx) => {
			await checkUserExists(tx.users, createTaskDto.userId);
			await tx.tasks.create({
				data: {
					description: createTaskDto.description,
					user_id: createTaskDto.userId,
					status: createTaskDto.status,
					title: createTaskDto.title,
				},
			});
		});
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

	async findOne(id: bigint): Promise<Result<null> | Result<TaskDto>> {
		const task = await this.prismaService.tasks.findFirst({ where: { id } });
		if (!task) {
			throw new NotExistException({ message: TASK_NOT_EXISTS });
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
		await this.prismaService.$transaction(async (tx) => {
			await checkTaskExists(tx.tasks, id);
			await tx.tasks.update({
				where: { id },
				data: {
					...(updateTaskDto.description
						? { description: updateTaskDto.description }
						: {}),
					...(updateTaskDto.status ? { status: updateTaskDto.status } : {}),
					...(updateTaskDto.title ? { title: updateTaskDto.title } : {}),
				},
			});
		});
		return createEmptyResult();
	}

	async remove(id: bigint) {
		await this.prismaService.$transaction(async (tx) => {
			await checkTaskExists(tx.tasks, id);
			await tx.tasks.delete({ where: { id } });
		});

		return createEmptyResult();
	}
}
