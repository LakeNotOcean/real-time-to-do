import { PartialType, PickType } from '@nestjs/swagger';
import { IdDto } from '../dto/id.dto';

export class IdQueryReqParam extends PickType(IdDto, ['id' as const]) {}

export class IdQueryOptParam extends PartialType(
	PickType(IdDto, ['id' as const]),
) {}
