import eslintJs from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';
import securityPlugin from 'eslint-plugin-security';

export default [
	{
		files: ['**/*.js'],
		ignores: ['**/node_modules/', '**/migrations/', '**/seeders/'],
		languageOptions: {
			sourceType: 'commonjs',
			globals: {
				...globals.node,
				...globals.es2021,
			},
		},
		plugins: {
			security: securityPlugin,
		},
		rules: {
			...eslintJs.configs.recommended.rules,
			'no-console': 'warn',
			'no-unused-vars': 'warn',
			'security/detect-object-injection': 'off',
			'security/detect-non-literal-require': 'warn',
		},
	},
	prettierConfig,
];
