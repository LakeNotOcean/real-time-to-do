import { BusinessException, ExceptionPayload, StatusEnum } from '@common';

export class NotExistException extends BusinessException {
	constructor(payload: ExceptionPayload) {
		super(StatusEnum.NotExistException, 'element does not exist', payload);
	}
}
