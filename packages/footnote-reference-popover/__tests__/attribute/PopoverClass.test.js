// @ts-check

import { describe, test, expect } from '@jest/globals';
import PopoverClass from '../../dist/attribute/PopoverClass.js';

describe('constructor', () => {
	test('no attribute', () => {
		expect(new PopoverClass(undefined).name).toBeUndefined();
	});

	test('text', () => {
		expect(new PopoverClass('text').name).toBe('text');
	});
});
