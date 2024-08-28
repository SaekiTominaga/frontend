// @ts-check

import { describe, test, expect } from '@jest/globals';
import Course from '../../dist/attribute/Course.js';

describe('constructor', () => {
	test('no course attribute', () => {
		expect(() => {
			new Course(undefined);
		}).toThrow('The `data-course` attribute value is not set.');
	});

	test('not allowed value', () => {
		expect(() => {
			new Course('xxx');
		}).toThrow('The `data-course` attribute value must be an "check" or "uncheck".');
	});

	test('allowed value', () => {
		expect(new Course('check').value).toBe('check');
	});
});
