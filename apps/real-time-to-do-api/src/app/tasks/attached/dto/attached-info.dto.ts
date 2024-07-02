import { PickType } from '@nestjs/swagger';
import { bigIntValueValueDec } from '../../../decorators/values-decorators/bigint-value.decorator';
import { stringValueDec } from '../../../decorators/values-decorators/string-value.decorator';
import { IdDto } from '../../../dto/id.dto';

export class AttachedInfoDto extends PickType(IdDto, ['id']) {
	@bigIntValueValueDec({ isRequired: true, minValue: BigInt(1) })
	taskId: bigint;
	@stringValueDec({ isRequired: true })
	name: string;
	constructor(args: Required<AttachedInfoDto>) {
		super();
		Object.assign(this, args);
	}
}
