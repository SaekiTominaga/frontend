import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect, jest } from '@jest/globals';
import InputIsbn from '../dist/InputIsbn.js';

customElements.define('x-isbn', InputIsbn, {
	extends: 'input',
});

describe('connected & disconnected', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML('beforeend', '<input is="x-isbn" data-validation-message-isbn-checkdigit="ISBN check digit is invalid.">');
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('connected', () => {
		expect(document.body.innerHTML).toBe(
			'<input is="x-isbn" data-validation-message-isbn-checkdigit="ISBN check digit is invalid." type="text" minlength="10" maxlength="17" pattern="(978|979)-\\d{1,5}-\\d{1,7}-\\d{1,7}-\\d|\\d{13}|\\d{1,5}-\\d{1,7}-\\d{1,7}-[\\dX]|\\d{9}[\\dX]">',
		);
	});
	test('disconnected', () => {
		document.querySelector('input[is="x-isbn"]').remove();
	});
});

describe('change event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML('beforeend', '<input is="x-isbn" data-validation-message-isbn-checkdigit="ISBN check digit is invalid.">');
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('empty', () => {
		const element = document.querySelector('input[is="x-isbn"]');

		element.dispatchEvent(new Event('change'));

		expect(element.value).toBe('');
	});

	test('invalid format', () => {
		const element = document.querySelector('input[is="x-isbn"]');

		element.value = 'foo';
		element.dispatchEvent(new Event('change'));

		// TODO: patternMismatch
	});
});

describe('submit event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML('beforeend', '<form><input is="x-isbn" data-validation-message-isbn-checkdigit="ISBN check digit is invalid."></form>');
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('invalid format', () => {
		const submitEvent = new Event('submit');
		submitEvent.preventDefault = jest.fn();

		const element = document.querySelector('input[is="x-isbn"]');
		const formElement = document.querySelector('form');

		element.value = 'foo';
		formElement.dispatchEvent(submitEvent);

		expect(submitEvent.preventDefault).toHaveBeenCalled();
	});

	test('illegal check digit', () => {
		const submitEvent = new Event('submit');
		submitEvent.preventDefault = jest.fn();

		const element = document.querySelector('input[is="x-isbn"]');
		const formElement = document.querySelector('form');

		element.value = '978-4-06-519981-0';
		formElement.dispatchEvent(submitEvent);

		expect(submitEvent.preventDefault).toHaveBeenCalled();
	});

	test('valid', () => {
		const submitEvent = new Event('submit');
		submitEvent.preventDefault = jest.fn();

		const element = document.querySelector('input[is="x-isbn"]');
		const formElement = document.querySelector('form');

		element.value = '978-4-06-519981-7';
		formElement.dispatchEvent(submitEvent);

		expect(submitEvent.preventDefault).not.toHaveBeenCalled();
	});
});
