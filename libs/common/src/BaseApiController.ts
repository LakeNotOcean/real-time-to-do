import { HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { JsonLogger } from './customLogger/JsonLogger';

export class BaseApiController {
	private readonly logger = new JsonLogger(BaseApiController.name);
	protected OkEmpty(response: FastifyReply): void {
		response.statusCode = HttpStatus.OK;
		response.send();
	}
	protected Ok<T>(response: FastifyReply, body?: T) {
		response.status(HttpStatus.OK).send(body);
	}
	protected Created<T>(response: FastifyReply, body: T) {
		response.statusCode = HttpStatus.CREATED;
		response.send(body);
	}
	protected MetadataException<T>(response: FastifyReply, body: T) {
		response.statusCode = 502;
		response.send(body);
	}
	protected Forbidden() {
		throw new HttpException(
			{
				status: HttpStatus.FORBIDDEN,
				message: 'No rights to perform action',
			},
			HttpStatus.FORBIDDEN,
		);
	}
	protected BadRequest(message = 'Bad request') {
		throw new HttpException(
			{ status: HttpStatus.BAD_REQUEST, message: message },
			HttpStatus.BAD_REQUEST,
		);
	}
	protected NotFound(message = 'Not Found') {
		throw new HttpException(
			{
				status: HttpStatus.NOT_FOUND,
				message: message,
			},
			HttpStatus.NOT_FOUND,
		);
	}
	protected InternalError(message?: string) {
		if (message) this.logger.error(message);
		throw new HttpException(
			{
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				message: message,
			},
			HttpStatus.INTERNAL_SERVER_ERROR,
		);
	}
}
