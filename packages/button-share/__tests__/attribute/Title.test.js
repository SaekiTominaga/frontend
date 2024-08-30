// @ts-check

import { describe, afterEach, test, expect } from '@jest/globals';
import Title from '../../dist/attribute/Title.js';

describe('constructor', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', () => {
		expect(new Title(undefined).text).toBeUndefined();
	});

	test('text', () => {
		expect(new Title('text').text).toBe('text');
	});
});
