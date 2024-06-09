export enum EnvEnum {
	dev = 'development',
	prod = 'production',
}

export function toEnvEnum(val: string): EnvEnum {
	switch (val) {
		case EnvEnum.prod: {
			return EnvEnum.prod;
		}
		default: {
			return EnvEnum.dev;
		}
	}
}
