import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function PatchDateValueDecorator(success: string) {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: success,
		}),
	);
}
