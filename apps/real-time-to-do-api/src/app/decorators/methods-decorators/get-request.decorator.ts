import { Get, Type, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { GetFromDbDecorator } from './actions/get-from-db.decorator';

export type getRequestDecOptions = {
	route?: string;
	description?: string;
	// eslint-disable-next-line @typescript-eslint/ban-types
	resultType: string | Function | Type<unknown> | [Function];
	isResultArray?: boolean;
	isTransaction?: boolean;
};

export function GetRequestDec(options: getRequestDecOptions) {
	return applyDecorators(
		Get(options.route),
		ApiOperation({ description: options.description ?? '' }),
		GetFromDbDecorator(options.resultType, options.isResultArray ?? false),
	);
}
