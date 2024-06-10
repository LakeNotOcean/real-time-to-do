import { PickType } from '@nestjs/swagger';
import { intAsStringValueDec } from '../decorators/values-decorators/int-as-string-value.decorator';
import { stringValueDec } from '../decorators/values-decorators/string-value.decorator';
import { IdDto } from './id.dto';

export class TaskDto extends PickType(IdDto, ['id'] as const) {
	@intAsStringValueDec({ isRequired: true, minValue: '1' })
	userId: string;
	@stringValueDec({ isRequired: true })
	title: string;
	@stringValueDec({ isRequired: true })
	description: string;
	status: string;
}
