import { EnvEnum } from '../enums';
export function getEnvRegex(env: EnvEnum): RegExp {
	switch (env) {
		case EnvEnum.dev:
			return /(dev|development)/;
		case EnvEnum.prod:
			return /(prod|production)/;
	}
}
