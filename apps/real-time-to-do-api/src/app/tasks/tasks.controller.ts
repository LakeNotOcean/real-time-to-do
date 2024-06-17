import { BaseApiController } from '@common';
import { Body, Controller, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { DeleteRequestDec } from '../decorators/methods-decorators/delete-request.decorator';
import { GetRequestDec } from '../decorators/methods-decorators/get-request.decorator';
import { PatchRequestDec } from '../decorators/methods-decorators/patch-request.decorator';
import { PostRequestDec } from '../decorators/methods-decorators/post-request.decorator';
import { TaskDto } from '../dto/task.dto';
import { IdQueryReqParam } from '../queries/id.query';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
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
		await this.tasksService.create(createTaskDto);
		return this.Created(response);
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
	async findOne(@Query('id') { id }: IdQueryReqParam) {
		return (await this.tasksService.findOne(id)).unwrap();
	}

	@PatchRequestDec({ responseString: 'task name changed successfully' })
	async update(
		@Query('id') { id }: IdQueryReqParam,
		@Body() updateTaskDto: UpdateTaskDto,
	) {
		return (await this.tasksService.update(id, updateTaskDto)).unwrap();
	}

	@DeleteRequestDec({ responseString: 'task removed successfully' })
	async remove(@Query('id') { id }: IdQueryReqParam) {
		return (await this.tasksService.remove(id)).unwrap();
	}
}
