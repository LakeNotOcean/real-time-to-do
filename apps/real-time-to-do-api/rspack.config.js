// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/rspack');

module.exports = composePlugins(withNx(), (config) => {
	config = {
		...config,
		externalsType: 'commonjs',
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
		},
	};
	return config;
});
