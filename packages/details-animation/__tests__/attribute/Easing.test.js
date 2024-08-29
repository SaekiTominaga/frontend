// @ts-check

import { describe, test, expect } from '@jest/globals';
import Easing from '../../dist/attribute/Easing.js';

describe('constructor', () => {
	test('null', () => {
		expect(new Easing(null).value).toBeUndefined();
	});

	test('not allowed value', () => {
		expect(() => {
			new Easing('xxx');
		}).toThrow('The value of the `data-easing` attribute must be "linear", "ease", "ease-in", "ease-out", "ease-in-out", "cubic-bezier", "step-start", "step-end", or "steps".');
	});

	test('allowed value', () => {
		expect(new Easing('ease').value).toBe('ease');
	});
});
