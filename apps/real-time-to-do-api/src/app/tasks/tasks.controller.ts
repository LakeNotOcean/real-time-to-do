import { BaseApiController } from '@common';
import { Body, Controller, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { IdQueryDec } from '../decorators/id-query.decorator';
import { DeleteRequestDec } from '../decorators/methods-decorators/delete-request.decorator';
import { GetRequestDec } from '../decorators/methods-decorators/get-request.decorator';
import { PatchRequestDec } from '../decorators/methods-decorators/patch-request.decorator';
import { PostRequestDec } from '../decorators/methods-decorators/post-request.decorator';
import { TaskDto } from '../dto/task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller()
@ApiTags('tasks')
export class TasksController extends BaseApiController {
	constructor(private readonly tasksService: TasksService) {
		super();
	}

	@PostRequestDec({
		responseString: 'task is added',
		description: 'create task',
	})
	async create(
		@Body() createTaskDto: CreateTaskDto,
		@Res() response: FastifyReply,
	) {
		const taskId = (await this.tasksService.create(createTaskDto)).unwrap();
		return this.Created(response, taskId);
	}

	@GetRequestDec({
		resultType: TaskDto,
		route: 'all',
		description: 'get tasks list',
	})
	async findAll() {
		return (await this.tasksService.findAll()).unwrap();
	}

	@GetRequestDec({
		resultType: TaskDto,
		isResultArray: true,
		description: 'get task',
	})
	async findOne(@IdQueryDec() id: bigint) {
		await this.tasksService.findOne(id);
		return;
	}

	@PatchRequestDec({ responseString: 'task name changed successfully' })
	async update(@IdQueryDec() id: bigint, @Body() updateTaskDto: UpdateTaskDto) {
		await this.tasksService.update(id, updateTaskDto);
		return;
	}

	@DeleteRequestDec({ responseString: 'task removed successfully' })
	async remove(@IdQueryDec() id: bigint) {
		await this.tasksService.remove(id);
		return;
	}
}
