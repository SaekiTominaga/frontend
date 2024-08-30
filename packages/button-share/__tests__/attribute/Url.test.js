// @ts-check

import { describe, afterEach, test, expect } from '@jest/globals';
import Url from '../../dist/attribute/Url.js';

describe('constructor', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', () => {
		expect(new Url(undefined).url).toBeUndefined();
	});

	test('invalid URL', () => {
		expect(() => {
			new Url('xxx');
		}).toThrow('The value of the `data-url` attribute must be a URL.');
	});

	test('text', () => {
		expect(new Url('http://example.com/').url?.toString()).toBe('http://example.com/');
	});
});
