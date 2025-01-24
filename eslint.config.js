// @ts-check

import globals from 'globals';
import w0sConfig from '@w0s/eslint-config';

/** @type {import("@typescript-eslint/utils/ts-eslint").FlatConfig.ConfigArray} */
export default [
	...w0sConfig,
	{
		ignores: ['@types', 'packages/*/dist'],
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.es2022,
			},
			parserOptions: {
				sourceType: 'module',
			},
		},
	},
	{
		files: ['packages/*/__tests__/**/*.test.js'],
		rules: {
			'require-await': 'off',
			'import/no-unassigned-import': 'off',
			'import/no-unresolved': 'off', // Github Actions 環境では /dist/ ファイルが存在しないためテスト不可
		},
	},
	{
		files: ['packages/*/src/**/*.ts'],
		rules: {
			'no-console': [
				'warn',
				{
					allow: ['info', 'error'],
				},
			],
			'@typescript-eslint/no-non-null-assertion': 'off',
		},
	},
	{
		files: ['packages/*/src/index.ts'],
		rules: {
			'no-new': 'off',
		},
	},
	{
		files: ['packages/button-confirm/src/ButtonConfirm.ts'],
		rules: {
			'no-alert': 'off',
		},
	},
	{
		files: ['packages/closest-html-page/src/ClosestHTMLPage.ts'],
		rules: {
			'no-await-in-loop': 'off',
			'no-continue': 'off',
		},
	},
];
