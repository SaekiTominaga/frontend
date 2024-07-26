// @ts-check

import globals from 'globals';
import tseslint from 'typescript-eslint';
import w0sConfig from '@w0s/eslint-config';

/** @type {import("@typescript-eslint/utils/ts-eslint").FlatConfig.ConfigArray} */
export default tseslint.config(
	...w0sConfig,
	{
		ignores: ['@types/', 'packages/*/dist/'],
		languageOptions: {
			globals: globals.browser,
			parserOptions: {
				sourceType: 'module',
			},
		},
		rules: {
			'no-console': [
				'warn',
				{
					allow: ['info', 'error'],
				},
			],
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
);
