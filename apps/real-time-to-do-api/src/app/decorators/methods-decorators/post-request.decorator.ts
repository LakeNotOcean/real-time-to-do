import { Post, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiQueryOptions } from '@nestjs/swagger';
import {
	InsertDataValueDec,
	InsertDataValueDecoratorArgs,
} from './actions/insert-data.decorator';

export type postRequestDecOptions = {
	route?: string;
	description?: string;
	responseString: string;
	responseArgs?: InsertDataValueDecoratorArgs;
	isResultArray?: boolean;
	apiQueryOptions?: ApiQueryOptions[];
};

export function PostRequestDec(options: postRequestDecOptions) {
	const decorators = [
		Post(options.route),
		ApiOperation({ description: options.description ?? '' }),
		InsertDataValueDec(options.responseString, options.responseArgs),
	];
	const apiQueries = options.apiQueryOptions?.map((opt) => ApiQuery(opt));
	if (apiQueries) {
		decorators.push(...apiQueries);
	}

	return applyDecorators(...decorators);
}
