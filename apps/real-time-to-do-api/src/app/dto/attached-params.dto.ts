import { stringValueDec } from '../decorators/values-decorators/string-value.decorator';

export class AttachedParamsDto {
	@stringValueDec({ isRequired: true })
	fileName: string;
}
