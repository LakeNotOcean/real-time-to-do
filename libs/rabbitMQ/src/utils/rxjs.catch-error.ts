import { JsonLogger } from '@common';
import { catchError, Observable, OperatorFunction } from 'rxjs';

export function rxjsCatchErrorWithLog<T>(
	logger: JsonLogger,
): OperatorFunction<T, T> {
	return catchError<T, Observable<T>>((err: object, caught) => {
		logger.error(err);
		return caught;
	});
}
