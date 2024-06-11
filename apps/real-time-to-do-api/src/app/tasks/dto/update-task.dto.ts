import { PartialType, PickType } from '@nestjs/swagger';
import { TaskDto } from '../../dto/task.dto';

export class UpdateTaskDto extends PartialType(
	PickType(TaskDto, ['description', 'status', 'title']),
) {}
