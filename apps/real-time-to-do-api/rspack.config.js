// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/rspack');

module.exports = composePlugins(withNx(), (config) => {
	config = {
		...config,
		externalsType: 'commonjs',
		// output: {
		// 	filename: '[name].js',
		// },
		externalsPresets: { node: true },
		target: 'node',
		externals: {
			'@nestjs/core': '@nestjs/core',
			'@nestjs/common': '@nestjs/common',
			'@nestjs/swagger': '@nestjs/swagger',
			'@nestjs/config': '@nestjs/config',
			dotent: 'dotent',
			prisma: 'prisma',
			'@prisma/client': '@prisma/client',
			'class-validator': 'class-validator',
			fastify: 'fastify',
			'@fastify/multipart': '@fastify/multipart',
			'@blazity/nest-file-fastify': '@blazity/nest-file-fastify',
			'@nestjs/platform-fastify': '@nestjs/platform-fastify',
			'nestjs-pino': 'nestjs-pino',
			'reflect-metadata': 'reflect-metadata',
			rxjs: 'rxjs',
			'class-transformer': 'class-transformer',
			'pino-pretty': 'pino-pretty',
			'@fastify/static': '@fastify/static',
		},
	};
	return config;
});
