import { PickType } from '@nestjs/swagger';
import { TaskDto } from '../../dto/task.dto';

export class CreateTaskDto extends PickType(TaskDto, [
	'description',
	'status',
	'title',
	'userId',
]) {}
