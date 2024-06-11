import { TaskEnum, toTaskEnum } from '@common';
import { PickType } from '@nestjs/swagger';
import { bigIntValueValueDec } from '../decorators/values-decorators/bigint-value.decorator';
import { enumValueDec } from '../decorators/values-decorators/enum-value.decorator';
import { stringValueDec } from '../decorators/values-decorators/string-value.decorator';
import { IdDto } from './id.dto';

export class TaskDto extends PickType(IdDto, ['id'] as const) {
	constructor(args: Required<TaskDto>) {
		super();
		Object.assign(this, args);
	}
	@bigIntValueValueDec({ isRequired: true, minValue: BigInt(1) })
	userId: bigint;
	@stringValueDec({ isRequired: true })
	title: string;
	@stringValueDec({ isRequired: true })
	description: string;

	@enumValueDec({
		isRequired: true,
		enumType: TaskEnum,
		parseFunc: toTaskEnum,
	})
	status: TaskEnum;
}
