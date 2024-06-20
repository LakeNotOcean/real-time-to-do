import {
	isNullOrUndefined,
	setValidationErrorConstraint,
	TransformWithValidationErrorDec,
	ValidationException,
} from '@common';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsOptional,
	ValidateIf,
	ValidationError,
} from 'class-validator';
import {
	GREATER_THAN_MAX_VALUE,
	IS_NOT_A_STRING,
	IS_NOT_AN_INT,
	LESS_THAN_MIN_VALUE,
} from '../../constants/validation-error.constant';

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
			description: 'js bigIntValue value',
		}),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		ValidateIf((_obj, value) => !(!opt.isRequired && isNullOrUndefined(value))),
		TransformWithValidationErrorDec((_key, value, error) => {
			return parseBigInt(value, opt, error);
		}),
	];
	return applyDecorators(...decorators);
}

export function parseBigInt(
	value: unknown,
	opt: bigIntValueDecOptions,
	error: ValidationError,
) {
	if (typeof value == 'bigint') {
		return value;
	}
	if (typeof value !== 'string') {
		setValidationErrorConstraint(error, IS_NOT_A_STRING);
		throw new ValidationException([error]);
	}
	let bigIntValue: bigint;
	try {
		bigIntValue = BigInt(value);
	} catch {
		setValidationErrorConstraint(error, IS_NOT_AN_INT);
		throw new ValidationException([error]);
	}
	if (opt.minValue && bigIntValue < opt.minValue) {
		setValidationErrorConstraint(error, LESS_THAN_MIN_VALUE);
		throw new ValidationException([error]);
	}
	if (opt.maxValue && bigIntValue > opt.maxValue) {
		setValidationErrorConstraint(error, GREATER_THAN_MAX_VALUE);
		throw new ValidationException([error]);
	}
	return bigIntValue;
}
