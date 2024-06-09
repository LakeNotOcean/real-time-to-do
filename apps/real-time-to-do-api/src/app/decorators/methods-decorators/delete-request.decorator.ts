import { Delete, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { DeleteDateValueDec } from './actions/delete-value.decorator';

export type deleteRequestDecOptions = {
	route?: string;
	description?: string;
	// eslint-disable-next-line @typescript-eslint/ban-types
	responseString: string;
	isResultArray?: boolean;
};

export function DeleteRequestDec(options: deleteRequestDecOptions) {
	const decorators = new Array<
		ClassDecorator | MethodDecorator | PropertyDecorator
	>();
	decorators.push(
		Delete(options.route),
		ApiOperation({ description: options.description ?? '' }),
		DeleteDateValueDec(options.responseString),
	);
	return applyDecorators(...decorators);
}
