// @ts-check

/** @type {import('@markuplint/ml-config').Config} */
export default {
	extends: ['@w0s/markuplint-config'],
	rules: {
		'no-empty-palpable-content': false,
		'character-reference': false,
	},
	nodeRules: [
		{
			selector: 'div',
			rules: {
				'required-attr': false,
			},
		},
		{
			selector: 'table, input, select, textarea',
			rules: {
				'require-accessible-name': false,
			},
		},
	],
};
