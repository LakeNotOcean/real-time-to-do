import {
	setValidationErrorConstraint,
	TransformWithValidationErrorDec,
	ValidationException,
} from '@common';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import {
	GREATER_THAN_MAX_VALUE,
	IS_NOT_A_STRING,
	LESS_THAN_MIN_VALUE,
} from '../../constants/error.constant';

export type bigIntValueDecOptions = {
	isRequired: boolean;
	minValue?: bigint;
	maxValue?: bigint;
};

export function bigIntValueValueDec(opt: bigIntValueDecOptions) {
	const decorators = [
		ApiProperty({
			required: opt.isRequired,
			type: 'string',
			example: '12345',
			description: 'js bigint value',
		}),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		ValidateIf((_obj, value) => value != null && value != undefined),
		TransformWithValidationErrorDec((_key, value, error) => {
			if (typeof value !== 'bigint') {
				setValidationErrorConstraint(error, IS_NOT_A_STRING);
				throw new ValidationException([error]);
			}
			if (opt.minValue && value < opt.minValue) {
				setValidationErrorConstraint(error, LESS_THAN_MIN_VALUE);
				throw new ValidationException([error]);
			}
			if (opt.maxValue && value > opt.maxValue) {
				setValidationErrorConstraint(error, GREATER_THAN_MAX_VALUE);
				throw new ValidationException([error]);
			}
			return value;
		}),
	];
	return applyDecorators(...decorators);
}
