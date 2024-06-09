import { applyDecorators, Patch } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PatchDateValueDecorator } from './actions/patch-data.decorator';

export type patchRequestDecOptions = {
	route?: string;
	description?: string;
	responseString: string;
	isResultArray?: boolean;
};

// required if due to dependency bug
export function PatchRequestDec(options: patchRequestDecOptions) {
	return applyDecorators(
		Patch(options.route),
		ApiOperation({ description: options.description ?? '' }),
		PatchDateValueDecorator(options.responseString),
	);
}
