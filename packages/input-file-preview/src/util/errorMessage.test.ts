import { describe, test, expect } from '@jest/globals';
import { convert } from './errorMessage.js';

describe('convert', () => {
	test('text', () => {
		const file = new File(['xxx'], 'foo.txt');

		const converted = convert('text', file);

		expect(converted).toBe('text');
	});

	test('variable name', () => {
		const file = new File(['xxx'], 'foo.txt');

		// eslint-disable-next-line no-template-curly-in-string
		const converted = convert('text ${name}', file);

		expect(converted).toBe('text foo.txt');
	});

	test('variable size', () => {
		const file = new File(['xxx'], 'foo.txt');

		// eslint-disable-next-line no-template-curly-in-string
		const converted = convert('text ${size}', file);

		expect(converted).toBe('text 3');
	});
});
