// @ts-check

import { describe, test, expect } from '@jest/globals';
import Mouseleave from '../../dist/attribute/Mouseleave.js';

describe('constructor', () => {
	test('no attribute', () => {
		expect(new Mouseleave({}).delay).toBeUndefined();
	});
});

describe('constructor - delay', () => {
	test('not number', () => {
		expect(() => {
			new Mouseleave({ delay: 'xxx' });
		}).toThrow('The value of the `data-mouseleave-delay` attribute must be a number.');
	});

	test('zero', () => {
		expect(() => {
			new Mouseleave({ delay: '0' });
		}).toThrow('The value of the `data-mouseleave-delay` attribute must be a number greater than zero.');
	});

	test('greater than 0', () => {
		expect(new Mouseleave({ delay: '1' }).delay).toBe(1);
	});
});
