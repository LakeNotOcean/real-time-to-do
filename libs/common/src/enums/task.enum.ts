import { createErrorResult, createSuccessResult, Result } from '../result';

export enum TaskEnum {
	Created = 'Created',
	InProcess = 'InProcess',
	Finish = 'Finish',
}

export function toTaskEnum(val: string): Result<TaskEnum> {
	switch (val) {
		case TaskEnum.Created: {
			return createSuccessResult(TaskEnum.Created);
		}
		case TaskEnum.Finish: {
			return createSuccessResult(TaskEnum.Finish);
		}
		case TaskEnum.InProcess: {
			return createSuccessResult(TaskEnum.InProcess);
		}
		default: {
			return createErrorResult('not a taskEnum');
		}
	}
}
