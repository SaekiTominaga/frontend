// @ts-check

import { describe, test, expect } from '@jest/globals';
import Title from '../../dist/attribute/Title.js';

describe('constructor', () => {
	test('no attribute', () => {
		expect(new Title(undefined).value).toBeUndefined();
	});

	test('valid', () => {
		expect(new Title('text').value).toBe('text');
	});
});
