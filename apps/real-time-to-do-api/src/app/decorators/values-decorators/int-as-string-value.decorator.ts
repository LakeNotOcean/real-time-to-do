import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Max,
	Min,
	ValidateIf,
} from 'class-validator';

export type intAsStringValueDecOptions = {
	isRequired: boolean;
	minValue?: string;
	maxValue?: string;
};

export function intAsStringValueDec(opt: intAsStringValueDecOptions) {
	const decorators = [
		ApiProperty({
			required: opt.isRequired,
			type: 'string',
			description: '12345',
		}),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		ValidateIf((_obj, value) => value != null && value != undefined),
		IsString(),
		IsInt(),
	];
	if (opt.minValue) {
		decorators.push(Min(parseInt(opt.minValue)));
	}
	if (opt.maxValue) {
		decorators.push(Max(parseInt(opt.maxValue)));
	}
	return applyDecorators(...decorators);
}
