import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvEnum } from '../enums';

export const configSwagger = (
	nodeApp: INestApplication<unknown>,
	env: EnvEnum,
	title: string,
	descirption: string,
) => {
	if (env == EnvEnum.prod) {
		return;
	}
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const foundVersion = require('../../../../package.json')?.version;
	const version = foundVersion ? foundVersion : 'unknown';
	const swaggerConfig = new DocumentBuilder()
		.setTitle(title)
		.setDescription(descirption)
		.setVersion(version)
		.build();

	const document = SwaggerModule.createDocument(nodeApp, swaggerConfig);
	SwaggerModule.setup(`swagger`, nodeApp, document);
};
