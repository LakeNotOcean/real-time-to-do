import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import {
	bigIntValueDecOptions,
	parseBigInt,
} from '../decorators/values-decorators/bigint-value.decorator';

@Injectable()
export class ParseBigIntPipe implements PipeTransform {
	constructor(private readonly opt: bigIntValueDecOptions) {}
	transform(value: unknown, _metadata: ArgumentMetadata) {
		const validationError = new ValidationError();
		validationError.property = _metadata.data || _metadata.type;
		return parseBigInt(value, this.opt, validationError);
	}
}
