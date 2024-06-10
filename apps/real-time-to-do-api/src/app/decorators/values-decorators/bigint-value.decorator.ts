import {
	setValidationErrorConstraint,
	TransformWithValidationErrorDec,
	ValidationException,
} from '@common';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateIf,
} from 'class-validator';
import { IS_NOT_A_STRING, IS_NOT_INT } from '../../constants/error.constant';

export type bigIntValueDecOptions = {
	isRequired: boolean;
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
		IsString(),
		IsInt(),
		TransformWithValidationErrorDec((_key, value, error) => {
			if (typeof value !== 'string') {
				setValidationErrorConstraint(error, IS_NOT_A_STRING);
				throw new ValidationException([error]);
			}
			let bigIntValue: bigint;
			try {
				bigIntValue = BigInt(value);
			} catch (err) {
				setValidationErrorConstraint(error, IS_NOT_INT);
				throw new ValidationException([error]);
			}
			return bigIntValue;
		}),
	];
	return applyDecorators(...decorators);
}
