import { applyDecorators, Get } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiResponse } from '@nestjs/swagger';

export type getFileRequestDecOptions = {
	route?: string;
	description?: string;
};

export function GetFileRequestDec(options: getFileRequestDecOptions) {
	return applyDecorators(
		Get(options.route),
		ApiOperation({ description: options.description ?? '' }),
		ApiProduces('application/octet-stream'),
		ApiResponse({
			status: 200,
			description: 'file sent successfully',
		}),
	);
}
