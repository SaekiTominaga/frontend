import { describe, afterEach, test, expect } from '@jest/globals';
import ValidationMessage from '../../dist/attribute/ValidationMessage.js';

describe('constructor', () => {
	afterEach(() => {
		document.body.innerHTML = '<input min="xxx" max="xxx">';
	});

	test('no noexist', () => {
		expect(() => {
			new ValidationMessage({ noexist: undefined, min: undefined, max: undefined }, document.querySelector('input'));
		}).toThrow('The `data-validation-noexist` attribute is not set.');
	});

	test('no min', () => {
		expect(() => {
			new ValidationMessage({ noexist: '', min: undefined, max: undefined }, document.querySelector('input'));
		}).toThrow('The `data-validation-min` attribute is not set.');
	});

	test('not max', () => {
		document.body.insertAdjacentHTML('beforeend', '<p id="dialog"></p>');

		expect(() => {
			new ValidationMessage({ noexist: '', min: '', max: undefined }, document.querySelector('input'));
		}).toThrow('The `data-validation-max` attribute is not set.');
	});

	test('exist element', () => {
		document.body.insertAdjacentHTML('beforeend', '<dialog id="dialog"></dialog>');

		const validationMessage = new ValidationMessage({ noexist: 'noexist', min: 'min', max: 'max' }, document.querySelector('input'));

		expect(validationMessage.noexist).toBe('noexist');
		expect(validationMessage.min).toBe('min');
		expect(validationMessage.max).toBe('max');
	});
});
