import { describe, test, expect } from '@jest/globals';
import ErrorMessage from '../dist/ErrorMessage.js';

describe('convert', () => {
	test('text', () => {
		const file = new File(['xxx'], 'foo.txt');

		const converted = ErrorMessage.convert('text', file);

		expect(converted).toBe('text');
	});

	test('variable name', () => {
		const file = new File(['xxx'], 'foo.txt');

		// eslint-disable-next-line no-template-curly-in-string
		const converted = ErrorMessage.convert('text ${name}', file);

		expect(converted).toBe('text foo.txt');
	});

	test('variable size', () => {
		const file = new File(['xxx'], 'foo.txt');

		// eslint-disable-next-line no-template-curly-in-string
		const converted = ErrorMessage.convert('text ${size}', file);

		expect(converted).toBe('text 3');
	});
});
