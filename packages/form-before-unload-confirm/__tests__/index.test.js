import { describe, beforeEach, test, expect } from '@jest/globals';
import index from '../dist/index.js';

describe('argument type', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<form id="form" class="form"></form>
<span></span>
`,
		);
	});

	test('getElementById', () => {
		expect(index(document.getElementById('form'))).toBe(undefined);
	});

	test('getElementsByClassName', () => {
		expect(index(document.getElementsByClassName('form'))).toBe(undefined);
	});

	test('getElementsByTagName', () => {
		expect(index(document.getElementsByTagName('form'))).toBe(undefined);
	});

	test('querySelector', () => {
		expect(index(document.querySelector('#form'))).toBe(undefined);
	});

	test('querySelectorAll', () => {
		expect(index(document.querySelectorAll('.form'))).toBe(undefined);
	});

	test('null', () => {
		expect(index(document.querySelector('.foo'))).toBe(undefined);
	});

	test('type mismatch', () => {
		expect(() => {
			index(document.querySelector('span'));
		}).toThrow('Element must be a `HTMLFormElement`');
	});
});
