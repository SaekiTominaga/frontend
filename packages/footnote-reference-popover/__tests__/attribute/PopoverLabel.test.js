// @ts-check

import { describe, test, expect } from '@jest/globals';
import PopoverLabel from '../../dist/attribute/PopoverLabel.js';

describe('constructor', () => {
	test('no attribute', () => {
		expect(new PopoverLabel(undefined).text).toBeUndefined();
	});

	test('text', () => {
		expect(new PopoverLabel('text').text).toBe('text');
	});
});
