import { FileValidator, Injectable } from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';

export type maxFilenameValidatorOptions = {
	maxFilenameLength: number;
};
export type IFileWithOriginName = IFile & {
	originalname: string;
};

@Injectable()
export class MaxFilenameValidator extends FileValidator<
	maxFilenameValidatorOptions,
	IFileWithOriginName
> {
	isValid(file?: IFileWithOriginName | undefined): boolean | Promise<boolean> {
		if (
			file &&
			Object.hasOwn(file, 'originalname') &&
			file.originalname.length <= this.validationOptions.maxFilenameLength
		) {
			return true;
		}
		return false;
	}
	buildErrorMessage(_file: unknown): string {
		return `file name length must be less than or equal to ${this.validationOptions.maxFilenameLength}`;
	}
}
