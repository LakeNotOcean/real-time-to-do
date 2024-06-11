import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export function AttachFileDescriptionDec(description?: string) {
	return applyDecorators(
		ApiConsumes('multipart/form-data'),
		ApiBody({
			schema: {
				type: 'object',
				description: description ? description : 'attached file',
				properties: {
					comment: { type: 'string' },
					outletId: { type: 'integer' },
					file: {
						type: 'string',
						format: 'binary',
					},
				},
			},
		}),
	);
}
