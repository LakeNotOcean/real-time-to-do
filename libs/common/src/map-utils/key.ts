export function getKey(...args: (number | string)[]): string {
	return args.join('_');
}
