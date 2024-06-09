import { Post, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
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
};

export function PostRequestDec(options: postRequestDecOptions) {
	return applyDecorators(
		Post(options.route),
		ApiOperation({ description: options.description ?? '' }),
		InsertDataValueDec(options.responseString, options.responseArgs),
	);
}
