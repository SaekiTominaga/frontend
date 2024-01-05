import { describe, afterEach, test, expect } from '@jest/globals';
import InputFilePreview from '../dist/InputFilePreview.js';

describe('HTML', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', () => {
		document.body.insertAdjacentHTML('beforeend', '<input class="js-input-file-preview" />');

		expect(() => {
			new InputFilePreview(document.querySelector('.js-input-file-preview'));
		}).toThrow('Not a `<input type=file>`.');
	});

	test('no data-preview', () => {
		document.body.insertAdjacentHTML('beforeend', '<input type="file" class="js-input-file-preview" />');

		expect(() => {
			new InputFilePreview(document.querySelector('.js-input-file-preview'));
		}).toThrow('Attribute: `data-preview` is not set.');
	});

	test('no preview', () => {
		document.body.insertAdjacentHTML('beforeend', '<input type="file" class="js-input-file-preview" data-preview="preview" />');

		expect(() => {
			new InputFilePreview(document.querySelector('.js-input-file-preview'));
		}).toThrow('Element: #preview can not found.');
	});

	test('not template', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input type="file" class="js-input-file-preview" data-preview="preview" />
<p id="preview">foo</p>
`,
		);

		expect(() => {
			new InputFilePreview(document.querySelector('.js-input-file-preview'));
		}).toThrow('Element: #preview must be a `<template>` element.');
	});

	test('no output', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input type="file" class="js-input-file-preview" data-preview="preview" />
<template id="preview">foo</template>
`,
		);

		expect(() => {
			new InputFilePreview(document.querySelector('.js-input-file-preview'));
		}).toThrow('There must be one `<output>` element within the `<template>` element.');
	});

	test('data-max-size', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input type="file" class="js-input-file-preview" data-preview="preview" data-max-size="100" />
<template id="preview">
<output>foo</output>
</template>
`,
		);

		new InputFilePreview(document.querySelector('.js-input-file-preview'));

		expect(document.body.innerHTML).toBe(`
<input type="file" class="js-input-file-preview" data-preview="preview" data-max-size="100">
<template id="preview">
<output>foo</output>
</template>
`);
	});
});

describe('change', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('success', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input type="file" class="js-input-file-preview" data-preview="preview" />
<template id="preview">
<output>foo</output>
</template>
`,
		);

		const element = document.querySelector('.js-input-file-preview');

		new InputFilePreview(element);

		element.dispatchEvent(new Event('change'));

		expect(document.body.innerHTML).toBe(`
<input type="file" class="js-input-file-preview" data-preview="preview">
<template id="preview">
<output>foo</output>
</template>
`);
	});
});
