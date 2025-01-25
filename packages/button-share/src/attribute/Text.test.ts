import { describe, test, expect } from '@jest/globals';
import Text from './Text.js';

describe('constructor', () => {
	test('no attribute', () => {
		expect(new Text(undefined).text).toBeUndefined();
	});

	test('text', () => {
		expect(new Text('text').text).toBe('text');
	});
});
