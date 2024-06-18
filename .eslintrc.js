module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js', 'webpack.config.js'],
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'no-mixed-spaces-and-tabs': 'off',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
		],
	},
};
