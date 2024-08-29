// @ts-check

import { describe, test, expect } from '@jest/globals';
import Duration from '../../dist/attribute/Duration.js';

describe('constructor', () => {
	test('null', () => {
		expect(new Duration(null).value).toBeUndefined();
	});

	test('not number', () => {
		expect(() => {
			new Duration('xxx');
		}).toThrow('The value of the `data-duration` attribute must be a number.');
	});

	test('negative number', () => {
		expect(() => {
			new Duration('-1');
		}).toThrow('The value of the `data-duration` attribute must be a positive number.');
	});

	test('zero', () => {
		expect(new Duration('0').value).toBe(0);
	});

	test('positive number', () => {
		expect(new Duration('0.1').value).toBe(0.1);
	});
});
