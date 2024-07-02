import { Get, Type, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiQueryOptions } from '@nestjs/swagger';
import { GetFromDbDecorator } from './actions/get-from-db.decorator';

export type getRequestDecOptions = {
	route?: string;
	description?: string;
	// eslint-disable-next-line @typescript-eslint/ban-types
	resultType: string | Function | Type<unknown> | [Function];
	isResultArray?: boolean;
	apiQueryOptions?: ApiQueryOptions[];
};

export function GetRequestDec(options: getRequestDecOptions) {
	const decorators: MethodDecorator[] = [
		Get(options.route),
		ApiOperation({ description: options.description ?? '' }),
		GetFromDbDecorator(options.resultType, options.isResultArray ?? false),
	];
	const apiQueries = options.apiQueryOptions?.map((opt) => ApiQuery(opt));
	if (apiQueries) {
		decorators.push(...apiQueries);
	}
	return applyDecorators(...decorators);
}
