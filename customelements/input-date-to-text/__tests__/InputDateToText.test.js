import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect } from '@jest/globals';
import InputDateToText from '../dist/InputDateToText.js';

customElements.define('x-date-to-text', InputDateToText, {
	extends: 'input',
});

describe('connected & disconnected', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML('beforeend', '<input type="date" is="x-date-to-text" data-validation-message-date-noexist="This date does not exist.">');
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('connected', () => {
		expect(document.body.innerHTML).toBe(
			'<input type="text" is="x-date-to-text" data-validation-message-date-noexist="This date does not exist." minlength="8" maxlength="10" pattern="([0-9０-９]{8})|([0-9０-９]{4}[-/－／][0-9０-９]{1,2}[-/－／][0-9０-９]{1,2})" placeholder="YYYY-MM-DD">',
		);
	});
	test('disconnected', () => {
		document.querySelector('input[is="x-date-to-text"]')?.remove();
	});
});

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('min', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<input type="date" is="x-date-to-text" min="2000-01-01" data-validation-message-date-noexist="This date does not exist." data-validation-message-date-min="Please enter a value after A.D.2000.">',
		);

		expect(document.body.innerHTML).toBe(
			'<input type="text" is="x-date-to-text" data-validation-message-date-noexist="This date does not exist." data-validation-message-date-min="Please enter a value after A.D.2000." minlength="8" maxlength="10" pattern="([0-9０-９]{8})|([0-9０-９]{4}[-/－／][0-9０-９]{1,2}[-/－／][0-9０-９]{1,2})" placeholder="YYYY-MM-DD">',
		);
	});

	test('max', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<input type="date" is="x-date-to-text" max="2020-12-31" data-validation-message-date-noexist="This date does not exist." data-validation-message-date-max="Please enter a value before A.D.2020.">',
		);

		expect(document.body.innerHTML).toBe(
			'<input type="text" is="x-date-to-text" data-validation-message-date-noexist="This date does not exist." data-validation-message-date-max="Please enter a value before A.D.2020." minlength="8" maxlength="10" pattern="([0-9０-９]{8})|([0-9０-９]{4}[-/－／][0-9０-９]{1,2}[-/－／][0-9０-９]{1,2})" placeholder="YYYY-MM-DD">',
		);
	});

	test('step', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<input type="date" is="x-date-to-text" step="1" data-validation-message-date-noexist="This date does not exist.">',
		);

		expect(document.body.innerHTML).toBe(
			'<input type="text" is="x-date-to-text" data-validation-message-date-noexist="This date does not exist." minlength="8" maxlength="10" pattern="([0-9０-９]{8})|([0-9０-９]{4}[-/－／][0-9０-９]{1,2}[-/－／][0-9０-９]{1,2})" placeholder="YYYY-MM-DD">',
		);
	});
});

describe('change event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML('beforeend', '<input type="date" is="x-date-to-text" data-validation-message-date-noexist="This date does not exist.">');
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('empty', () => {
		const element = document.querySelector('input[is="x-date-to-text"]');

		element.dispatchEvent(new Event('change'));

		expect(element.value).toBe('');
	});

	test('invalid format', () => {
		const element = document.querySelector('input[is="x-date-to-text"]');

		element.value = 'foo';
		element.dispatchEvent(new Event('change'));

		// TODO:
	});
});

describe('submit event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<form><input type="date" is="x-date-to-text" data-validation-message-date-noexist="This date does not exist."></form>',
		);
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('empty', () => {
		const element = document.querySelector('input[is="x-date-to-text"]');

		document.querySelector('form')?.dispatchEvent(new Event('submit'));

		expect(element.value).toBe('');
	});

	test('invalid format', () => {
		const element = document.querySelector('input[is="x-date-to-text"]');

		element.value = 'foo';
		document.querySelector('form')?.dispatchEvent(new Event('submit'));

		// TODO:
	});
});

describe('value pattern', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML('beforeend', '<input type="date" is="x-date-to-text" data-validation-message-date-noexist="This date does not exist.">');
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('zenkaku', () => {
		const element = document.querySelector('input[is="x-date-to-text"]');

		element.value = '２０００－０１－０１';
		element.dispatchEvent(new Event('change'));

		expect(element.value).toBe('2000-01-01');
	});

	test('20000101', () => {
		const element = document.querySelector('input[is="x-date-to-text"]');

		element.value = '20000101';
		element.dispatchEvent(new Event('change'));

		expect(element.value).toBe('2000-01-01');
	});

	test('2000/1/1', () => {
		const element = document.querySelector('input[is="x-date-to-text"]');

		element.value = '2000/1/1';
		element.dispatchEvent(new Event('change'));

		expect(element.value).toBe('2000-01-01');
	});
});

describe('invalid value', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<input type="date" min="2000-01-01" max="2020-12-31" is="x-date-to-text" data-validation-message-date-noexist="This date does not exist." data-validation-message-date-min="Please enter a value after A.D.2000." data-validation-message-date-max="Please enter a value before A.D.2020.">',
		);
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no exist date', () => {
		const element = document.querySelector('input[is="x-date-to-text"]');

		element.value = '2000-02-31';
		element.dispatchEvent(new Event('change'));

		// TODO:
	});

	test('past', () => {
		const element = document.querySelector('input[is="x-date-to-text"]');

		element.value = '1999-12-31';
		element.dispatchEvent(new Event('change'));

		// TODO:
	});

	test('future', () => {
		const element = document.querySelector('input[is="x-date-to-text"]');

		element.value = '2099-01-01';
		element.dispatchEvent(new Event('change'));

		// TODO:
	});
});
