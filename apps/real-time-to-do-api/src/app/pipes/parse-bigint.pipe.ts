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
		return parseBigInt(value, this.opt, new ValidationError());
	}
}
