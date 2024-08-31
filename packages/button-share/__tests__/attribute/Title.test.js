// @ts-check

import { describe, test, expect } from '@jest/globals';
import Title from '../../dist/attribute/Title.js';

describe('constructor', () => {
	test('no attribute', () => {
		expect(new Title(undefined).text).toBeUndefined();
	});

	test('text', () => {
		expect(new Title('text').text).toBe('text');
	});
});
