// @ts-check

import { describe, test, expect } from '@jest/globals';
import PopoverHide from '../../dist/attribute/PopoverHide.js';

describe('constructor - text', () => {
	test('no attribute', () => {
		expect(new PopoverHide({}).text).toBeUndefined();
	});

	test('set attribute', () => {
		expect(new PopoverHide({ text: 'text' }).text).toBe('text');
	});
});

describe('constructor - imageSrc', () => {
	test('no attribute', () => {
		expect(new PopoverHide({}).imageSrc).toBeUndefined();
	});

	test('set attribute', () => {
		expect(new PopoverHide({ imageSrc: 'path/to' }).imageSrc).toBe('path/to');
	});
});

describe('constructor - imageWidth', () => {
	test('no attribute', () => {
		expect(new PopoverHide({}).imageWidth).toBeUndefined();
	});

	test('not number', () => {
		expect(() => {
			new PopoverHide({ imageWidth: 'xxx' });
		}).toThrow('The value of the `data-popover-hide-image-width` attribute must be a number.');
	});

	test('zero', () => {
		expect(() => {
			new PopoverHide({ imageWidth: '0' });
		}).toThrow('The value of the `data-popover-hide-image-width` attribute must be a number greater than zero.');
	});

	test('greater than 0', () => {
		expect(new PopoverHide({ imageWidth: '1' }).imageWidth).toBe(1);
	});
});

describe('constructor - imageHeight', () => {
	test('no attribute', () => {
		expect(new PopoverHide({}).imageHeight).toBeUndefined();
	});

	test('not number', () => {
		expect(() => {
			new PopoverHide({ imageHeight: 'xxx' });
		}).toThrow('The value of the `data-popover-hide-image-height` attribute must be a number.');
	});

	test('zero', () => {
		expect(() => {
			new PopoverHide({ imageHeight: '0' });
		}).toThrow('The value of the `data-popover-hide-image-height` attribute must be a number greater than zero.');
	});

	test('greater than 0', () => {
		expect(new PopoverHide({ imageHeight: '1' }).imageHeight).toBe(1);
	});
});
