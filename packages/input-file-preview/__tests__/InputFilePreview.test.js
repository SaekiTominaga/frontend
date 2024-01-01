import { describe, afterEach, test, expect } from '@jest/globals';
import InputFilePreview from '../dist/InputFilePreview.js';

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', () => {
		document.body.insertAdjacentHTML('beforeend', '<input class="js-file-preview" />');

		expect(() => {
			new InputFilePreview(document.querySelector('.js-file-preview'));
		}).toThrow('Not a `<input type=file>`.');
	});

	test('no data-preview', () => {
		document.body.insertAdjacentHTML('beforeend', '<input type="file" class="js-file-preview" />');

		expect(() => {
			new InputFilePreview(document.querySelector('.js-file-preview'));
		}).toThrow('Attribute: `data-preview` is not set.');
	});

	test('no data-error-message', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input type="file" class="js-file-preview" data-preview="preview" />
<p id="preview"></p>
`,
		);

		expect(() => {
			new InputFilePreview(document.querySelector('.js-file-preview'));
		}).toThrow('Attribute: `data-error-message` is not set.');
	});
});

describe('element', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no preview', () => {
		document.body.insertAdjacentHTML('beforeend', '<input type="file" class="js-file-preview" data-preview="preview" />');

		expect(() => {
			new InputFilePreview(document.querySelector('.js-file-preview'));
		}).toThrow('Element: #preview can not found.');
	});
});

describe('change', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('data-max-size', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input type="file" class="js-file-preview" data-preview="preview" data-error-message="error" />
<p id="preview">foo</p>
`,
		);

		const element = document.querySelector('.js-file-preview');

		new InputFilePreview(element);

		element.dispatchEvent(new Event('change'));

		expect(document.body.innerHTML).toBe(`
<input type="file" class="js-file-preview" data-preview="preview" data-error-message="error">
<p id="preview"></p>
`);
	});
});
