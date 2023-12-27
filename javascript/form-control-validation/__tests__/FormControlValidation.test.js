import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect } from '@jest/globals';
import FormControlValidation from '../dist/FormControlValidation.js';

describe('element', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<p id="message"></p>
`,
		);
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('form control', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input aria-errormessage="message" id="input">
`,
		);

		const element = document.getElementById('input');
		const formControlValidation = new FormControlValidation(element);
		formControlValidation.init();

		expect(document.getElementById('message')?.outerHTML).toBe('<p id="message" role="alert"></p>');
	});

	test('radiogroup', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<div role="radiogroup" aria-errormessage="message" id="radiogroup">
<input type="radio">
</div>
`,
		);

		const element = document.getElementById('radiogroup');
		const formControlValidation = new FormControlValidation(element);
		formControlValidation.init();

		expect(document.getElementById('message')?.outerHTML).toBe('<p id="message" role="alert"></p>');
	});

	test('Other than form controls', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<div aria-errormessage="message" id="div"></div>
`,
		);

		const element = document.getElementById('div');
		const formControlValidation = new FormControlValidation(element);

		expect(() => {
			formControlValidation.init();
		}).toThrow('The `FormControlValidation` feature can only be specified for <input>, <textarea> or <XXX role="radiogroup">.');
	});
});

describe('event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input required="" aria-errormessage="message">
<p id="message"></p>
`,
		);
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('change - valid', () => {
		const element = document.querySelector('input');

		const formControlValidation = new FormControlValidation(element);
		formControlValidation.init();

		element.value = 'foo';
		element?.dispatchEvent(new Event('change'));

		expect(document.body.innerHTML).toBe(`
<input required="" aria-errormessage="message" aria-invalid="false">
<p id="message" role="alert" hidden=""></p>
`);
	});

	test('change - invalid', () => {
		const element = document.querySelector('input');

		const formControlValidation = new FormControlValidation(element);
		formControlValidation.init();

		element?.dispatchEvent(new Event('change'));

		expect(document.body.innerHTML).toBe(`
<input required="" aria-errormessage="message" aria-invalid="true">
<p id="message" role="alert">Constraints not satisfied</p>
`);
	});

	test('invalid', () => {
		const element = document.querySelector('input');

		const formControlValidation = new FormControlValidation(element);
		formControlValidation.init();

		element?.dispatchEvent(new Event('invalid'));

		expect(document.body.innerHTML).toBe(`
<input required="" aria-errormessage="message" aria-invalid="true">
<p id="message" role="alert">Constraints not satisfied</p>
`);
	});
});

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no aria-errormessage', () => {
		document.body.insertAdjacentHTML('beforeend', '<input>');

		const element = document.querySelector('input');
		const formControlValidation = new FormControlValidation(element);

		expect(() => {
			formControlValidation.init();
		}).toThrow('Attribute: `aria-errormessage` is not set.');
	});

	test('no element specified by aria-errormessage attribute', () => {
		document.body.insertAdjacentHTML('beforeend', '<input aria-errormessage="message">');

		const element = document.querySelector('input');
		const formControlValidation = new FormControlValidation(element);

		expect(() => {
			formControlValidation.init();
		}).toThrow('Element: #message can not found.');
	});

	test('data-validation-message-pattern', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input pattern="[A-Z]+" aria-errormessage="message" data-validation-message-pattern="error message">
<p id="message"></p>
`,
		);

		const element = document.querySelector('input');
		const formControlValidation = new FormControlValidation(element);
		formControlValidation.init();

		element.value = 'foo';
		element?.dispatchEvent(new Event('change'));

		expect(document.body.innerHTML).toBe(`
<input pattern="[A-Z]+" aria-errormessage="message" data-validation-message-pattern="error message" aria-invalid="true">
<p id="message" role="alert">error message</p>
`);
	});
});
