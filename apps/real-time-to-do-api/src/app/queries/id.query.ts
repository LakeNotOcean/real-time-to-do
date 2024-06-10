import { PickType } from '@nestjs/swagger';
import { IdDto } from '../dto/id.dto';

export class IdQueryParam extends PickType(IdDto, ['id' as const]) {}
