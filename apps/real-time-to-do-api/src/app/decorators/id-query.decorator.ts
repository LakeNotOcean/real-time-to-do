import { Query } from '@nestjs/common';
import { ParseBigIntPipe } from '../pipes/parse-bigint.pipe';

export const IdQueryDec = () =>
	Query('id', new ParseBigIntPipe({ isRequired: true, minValue: BigInt(1) }));
