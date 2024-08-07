import {
	isNullOrUndefined,
	Result,
	setValidationErrorConstraint,
	StatusEnum,
	TransformWithValidationErrorDec,
	ValidationException,
} from '@common';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { IS_NOT_A_STRING } from '../../constants/validation-error.constant';

export type enumValueDecOptions = {
	isRequired: boolean;
	enumType: Record<string, string>;
	parseFunc: (val: string) => Result<unknown>;
};

export function enumValueDec(opt: enumValueDecOptions) {
	const decorators = [
		ApiProperty({ required: opt.isRequired, enum: opt.enumType }),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		ValidateIf((_obj, value) => !(!opt.isRequired && isNullOrUndefined(value))),
		TransformWithValidationErrorDec((key, value, error) => {
			if (typeof value !== 'string') {
				setValidationErrorConstraint(error, IS_NOT_A_STRING);
				throw new ValidationException([error]);
			}
			const parseResult = opt.parseFunc(value);
			if (parseResult.getStatus() != StatusEnum.Success) {
				setValidationErrorConstraint(error, {
					key: 'EnumIsNotValid',
					message: `"${value}" is not valid enum for ${key}`,
				});
				throw new ValidationException([error]);
			}
			return parseResult.unwrap();
		}),
	];
	return applyDecorators(...decorators);
}
