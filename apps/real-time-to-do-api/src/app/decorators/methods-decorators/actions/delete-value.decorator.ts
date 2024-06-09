import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function DeleteDateValueDec(success: string) {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: success,
		}),
	);
}
