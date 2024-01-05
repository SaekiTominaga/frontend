import { describe, beforeEach, afterEach, test, expect, jest } from '@jest/globals';
import InputIsbn from '../dist/InputIsbn.js';

describe('HTML', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no `data-error-message` attribute', () => {
		document.body.insertAdjacentHTML('beforeend', '<input class="js-input-isbn">');

		expect(() => {
			new InputIsbn(document.querySelector('.js-input-isbn'));
		}).toThrow('Attribute: `data-validation-message-isbn-checkdigit` is not set.');
	});

	test('success', () => {
		document.body.insertAdjacentHTML('beforeend', '<input class="js-input-isbn" data-validation-message-isbn-checkdigit="ISBN check digit is invalid.">');

		new InputIsbn(document.querySelector('.js-input-isbn'));

		expect(document.body.innerHTML).toBe(
			'<input class="js-input-isbn" data-validation-message-isbn-checkdigit="ISBN check digit is invalid." minlength="10" maxlength="17" pattern="(978|979)-[0-9]{1,5}-[0-9]{1,7}-[0-9]{1,7}-[0-9]|[0-9]{13}|[0-9]{1,5}-[0-9]{1,7}-[0-9]{1,7}-[0-9X]|[0-9]{9}[0-9X]">',
		);
	});
});

describe('change event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML('beforeend', '<input class="js-input-isbn" data-validation-message-isbn-checkdigit="ISBN check digit is invalid.">');

		new InputIsbn(document.querySelector('.js-input-isbn'));
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('empty', () => {
		const element = document.querySelector('.js-input-isbn');

		element.dispatchEvent(new Event('change'));

		expect(element.value).toBe('');
	});

	test('invalid format', () => {
		const element = document.querySelector('.js-input-isbn');

		element.value = 'foo';
		element.dispatchEvent(new Event('change'));

		// TODO: patternMismatch
	});
});

describe('submit event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<form><input class="js-input-isbn" data-validation-message-isbn-checkdigit="ISBN check digit is invalid."></form>',
		);

		new InputIsbn(document.querySelector('.js-input-isbn'));
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('invalid format', () => {
		const submitEvent = new Event('submit');
		submitEvent.preventDefault = jest.fn();

		document.querySelector('.js-input-isbn').value = 'foo';
		document.querySelector('form').dispatchEvent(submitEvent);

		expect(submitEvent.preventDefault).toHaveBeenCalled();
	});

	test('illegal check digit', () => {
		const submitEvent = new Event('submit');
		submitEvent.preventDefault = jest.fn();

		document.querySelector('.js-input-isbn').value = '978-4-06-519981-0';
		document.querySelector('form').dispatchEvent(submitEvent);

		expect(submitEvent.preventDefault).toHaveBeenCalled();
	});

	test('valid', () => {
		const submitEvent = new Event('submit');
		submitEvent.preventDefault = jest.fn();

		document.querySelector('.js-input-isbn').value = '978-4-06-519981-7';
		document.querySelector('form').dispatchEvent(submitEvent);

		expect(submitEvent.preventDefault).not.toHaveBeenCalled();
	});
});
