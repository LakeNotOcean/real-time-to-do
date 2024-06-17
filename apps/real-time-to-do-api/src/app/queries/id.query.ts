import { PartialType, PickType } from '@nestjs/swagger';
import { bigIntValueValueDec } from '../decorators/values-decorators/bigint-value.decorator';
import { IdDto } from '../dto/id.dto';

export class IdQueryReqParam {
	@bigIntValueValueDec({ isRequired: true, minValue: BigInt(1) })
	id: bigint;
}

export class IdQueryOptParam extends PartialType(
	PickType(IdDto, ['id' as const]),
) {}
