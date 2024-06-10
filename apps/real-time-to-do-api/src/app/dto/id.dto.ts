import { bigIntValueValueDec } from '../decorators/values-decorators/bigint-value.decorator';

export class IdDto {
	@bigIntValueValueDec({ isRequired: true })
	id: bigint;
}
