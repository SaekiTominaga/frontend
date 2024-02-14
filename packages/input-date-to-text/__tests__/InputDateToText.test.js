import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import InputDateToText from '../dist/InputDateToText.js';

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', () => {
		document.body.insertAdjacentHTML('beforeend', '<input type="date" class="js-input-date-to-text">');

		expect(() => {
			new InputDateToText(document.querySelector('.js-input-date-to-text'));
		}).toThrow('Attribute: `data-validation-noexist` is not set.');
	});

	test('data-title', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<input type="date" class="js-input-date-to-text" data-title="Dates should be consecutive numbers or separated by `-` or `/` in the order of year, month, and day." data-validation-noexist="This date does not exist." min="2000-01-01" data-validation-min="Please enter a value after A.D.2000.">',
		);

		new InputDateToText(document.querySelector('.js-input-date-to-text'));

		expect(document.body.innerHTML).toBe(
			'<input type="text" class="js-input-date-to-text" data-validation-noexist="This date does not exist." data-validation-min="Please enter a value after A.D.2000." minlength="8" pattern="([0-9０-９]{8})|([0-9０-９]{4}[\\-\\/－／][0-9０-９]{1,2}[\\-\\/－／][0-9０-９]{1,2})" placeholder="YYYY-MM-DD" title="Dates should be consecutive numbers or separated by `-` or `/` in the order of year, month, and day.">',
		);
	});

	test('min', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<input type="date" class="js-input-date-to-text" data-validation-noexist="This date does not exist." min="2000-01-01" data-validation-min="Please enter a value after A.D.2000.">',
		);

		new InputDateToText(document.querySelector('.js-input-date-to-text'));

		expect(document.body.innerHTML).toBe(
			'<input type="text" class="js-input-date-to-text" data-validation-noexist="This date does not exist." data-validation-min="Please enter a value after A.D.2000." minlength="8" pattern="([0-9０-９]{8})|([0-9０-９]{4}[\\-\\/－／][0-9０-９]{1,2}[\\-\\/－／][0-9０-９]{1,2})" placeholder="YYYY-MM-DD">',
		);
	});

	test('min - no data-*', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<input type="date" class="js-input-date-to-text" data-validation-noexist="This date does not exist." min="2000-01-01">',
		);

		expect(() => {
			new InputDateToText(document.querySelector('.js-input-date-to-text'));
		}).toThrow('Attribute: `data-validation-min` is not set.');
	});

	test('max', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<input type="date" class="js-input-date-to-text" data-validation-noexist="This date does not exist." max="2020-12-31" data-validation-max="Please enter a value before A.D.2020.">',
		);

		new InputDateToText(document.querySelector('.js-input-date-to-text'));

		expect(document.body.innerHTML).toBe(
			'<input type="text" class="js-input-date-to-text" data-validation-noexist="This date does not exist." data-validation-max="Please enter a value before A.D.2020." minlength="8" pattern="([0-9０-９]{8})|([0-9０-９]{4}[\\-\\/－／][0-9０-９]{1,2}[\\-\\/－／][0-9０-９]{1,2})" placeholder="YYYY-MM-DD">',
		);
	});

	test('max - no data-*', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<input type="date" class="js-input-date-to-text" data-validation-noexist="This date does not exist." max="2020-12-31">',
		);

		expect(() => {
			new InputDateToText(document.querySelector('.js-input-date-to-text'));
		}).toThrow('Attribute: `data-validation-max` is not set.');
	});

	test('step', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<input type="date" class="js-input-date-to-text" data-validation-noexist="This date does not exist." step="1">',
		);

		new InputDateToText(document.querySelector('.js-input-date-to-text'));

		expect(document.body.innerHTML).toBe(
			'<input type="text" class="js-input-date-to-text" data-validation-noexist="This date does not exist." minlength="8" pattern="([0-9０-９]{8})|([0-9０-９]{4}[\\-\\/－／][0-9０-９]{1,2}[\\-\\/－／][0-9０-９]{1,2})" placeholder="YYYY-MM-DD">',
		);
	});
});

describe('change event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<input type="date" class="js-input-date-to-text" data-validation-noexist="This date does not exist.">',
		);

		new InputDateToText(document.querySelector('.js-input-date-to-text'));
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('empty', () => {
		const element = document.querySelector('input[class="js-input-date-to-text"]');

		element.dispatchEvent(new Event('change'));

		expect(element.value).toBe('');
	});

	test('invalid format', () => {
		const element = document.querySelector('input[class="js-input-date-to-text"]');

		element.value = 'foo';
		element.dispatchEvent(new Event('change'));

		// TODO:
	});
});

describe('submit event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<form><input type="date" class="js-input-date-to-text" data-validation-noexist="This date does not exist."></form>',
		);

		new InputDateToText(document.querySelector('.js-input-date-to-text'));
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('empty', () => {
		const element = document.querySelector('input[class="js-input-date-to-text"]');

		document.querySelector('form')?.dispatchEvent(new Event('submit'));

		expect(element.value).toBe('');
	});

	test('invalid format', () => {
		const element = document.querySelector('input[class="js-input-date-to-text"]');

		element.value = 'foo';
		document.querySelector('form')?.dispatchEvent(new Event('submit'));

		// TODO:
	});
});

describe('value pattern', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<input type="date" class="js-input-date-to-text" data-validation-noexist="This date does not exist.">',
		);

		new InputDateToText(document.querySelector('.js-input-date-to-text'));
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('zenkaku', () => {
		const element = document.querySelector('input[class="js-input-date-to-text"]');

		element.value = '２０００－０１－０１';
		element.dispatchEvent(new Event('change'));

		expect(element.value).toBe('2000-01-01');
	});

	test('20000101', () => {
		const element = document.querySelector('input[class="js-input-date-to-text"]');

		element.value = '20000101';
		element.dispatchEvent(new Event('change'));

		expect(element.value).toBe('2000-01-01');
	});

	test('2000/1/1', () => {
		const element = document.querySelector('input[class="js-input-date-to-text"]');

		element.value = '2000/1/1';
		element.dispatchEvent(new Event('change'));

		expect(element.value).toBe('2000-01-01');
	});

	test('2000-1-1', () => {
		const element = document.querySelector('input[class="js-input-date-to-text"]');

		element.value = '2000-1-1';
		element.dispatchEvent(new Event('change'));

		expect(element.value).toBe('2000-01-01');
	});
});

describe('invalid value', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<input type="date" min="2000-01-01" max="2020-12-31" class="js-input-date-to-text" data-validation-noexist="This date does not exist." data-validation-min="Please enter a value after A.D.2000." data-validation-max="Please enter a value before A.D.2020.">',
		);

		new InputDateToText(document.querySelector('.js-input-date-to-text'));
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no exist date', () => {
		const element = document.querySelector('input[class="js-input-date-to-text"]');

		element.value = '2000-02-31';
		element.dispatchEvent(new Event('change'));

		// TODO:
	});

	test('past', () => {
		const element = document.querySelector('input[class="js-input-date-to-text"]');

		element.value = '1999-12-31';
		element.dispatchEvent(new Event('change'));

		// TODO:
	});

	test('future', () => {
		const element = document.querySelector('input[class="js-input-date-to-text"]');

		element.value = '2099-01-01';
		element.dispatchEvent(new Event('change'));

		// TODO:
	});
});
