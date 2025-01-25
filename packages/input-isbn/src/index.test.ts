import { describe, beforeEach, test, expect } from '@jest/globals';
import index from './index.js';

describe('argument type', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input id="input" class="input" data-validation-message-isbn-checkdigit="ISBN check digit is invalid.">
<span></span>
`,
		);
	});

	test('getElementById', () => {
		expect(index(document.getElementById('input'))).toBe(undefined);
	});

	test('getElementsByClassName', () => {
		expect(index(document.getElementsByClassName('input'))).toBe(undefined);
	});

	test('getElementsByTagName', () => {
		expect(index(document.getElementsByTagName('input'))).toBe(undefined);
	});

	test('querySelector', () => {
		expect(index(document.querySelector('#input'))).toBe(undefined);
	});

	test('querySelectorAll', () => {
		expect(index(document.querySelectorAll('.input'))).toBe(undefined);
	});

	test('null', () => {
		expect(index(document.querySelector('.foo'))).toBe(undefined);
	});

	test('type mismatch', () => {
		expect(() => {
			index(document.querySelector('span'));
		}).toThrow('Element must be a `HTMLInputElement`');
	});
});
