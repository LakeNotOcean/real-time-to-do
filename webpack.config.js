const swcDefaultConfig =
	require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory()
		.swcOptions;

module.exports = {
	// ...options,
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: {
					loader: 'swc-loader',
					options: swcDefaultConfig,
				},
			},
		],
	},
};
