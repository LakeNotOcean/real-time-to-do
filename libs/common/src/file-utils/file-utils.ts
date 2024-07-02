export enum fileUnitPostfix {
	byte = 'b',
	kilobyte = 'kb',
	megabyte = 'mb',
	gigabyte = 'gb',
}
const factor = 1024;

export const toBytes = (fileUnit: string): number => {
	const intValue = parseInt(fileUnit, 10);
	const measure = fileUnit.replace(intValue.toString(), '') as fileUnitPostfix;

	switch (measure) {
		case fileUnitPostfix.byte:
			return intValue;
		case fileUnitPostfix.kilobyte:
			return intValue * factor;
		case fileUnitPostfix.megabyte:
			return intValue * factor * factor;
		case fileUnitPostfix.gigabyte:
			return intValue * factor * factor * factor;
		default:
			throw new Error('not implemented');
	}
};
