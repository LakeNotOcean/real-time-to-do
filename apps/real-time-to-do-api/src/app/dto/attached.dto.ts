import { StreamableFile } from '@nestjs/common';
import { PickType } from '@nestjs/swagger';
import { AttachFileDescriptionDec } from '../decorators/methods-decorators/actions/attach-file-description.decorator';
import { bigIntValueValueDec } from '../decorators/values-decorators/bigint-value.decorator';
import { stringValueDec } from '../decorators/values-decorators/string-value.decorator';
import { IdDto } from './id.dto';

export class AttachedDto extends PickType(IdDto, ['id']) {
	constructor(args: Required<AttachedDto>) {
		super();
		Object.assign(this, args);
	}
	@stringValueDec({ isRequired: true })
	name: string;
	@bigIntValueValueDec({ isRequired: true, minValue: BigInt(1) })
	taskId: bigint;

	@AttachFileDescriptionDec()
	file: StreamableFile;
}
