import { stringValueDec } from '../decorators/values-decorators/string-value.decorator';

export class NameDto {
	@stringValueDec({ isRequired: true })
	name: string;
}
