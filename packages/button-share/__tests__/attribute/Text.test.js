// @ts-check

import { describe, afterEach, test, expect } from '@jest/globals';
import Text from '../../dist/attribute/Text.js';

describe('constructor', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', () => {
		expect(new Text(undefined).text).toBeUndefined();
	});

	test('text', () => {
		expect(new Text('text').text).toBe('text');
	});
});
