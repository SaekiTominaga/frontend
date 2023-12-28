import { describe, beforeAll, afterAll, afterEach, test, expect } from '@jest/globals';
import InputFilePreview from '../dist/InputFilePreview.js';

customElements.define('x-file-preview', InputFilePreview, {
	extends: 'input',
});

describe('connected & disconnected', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input is="x-file-preview" data-target-for="preview" data-error-message="error" />
<p id="preview"></p>
`,
		);
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('connected', () => {
		expect(document.body.innerHTML).toBe(`
<input is="x-file-preview" data-target-for="preview" data-error-message="error" type="file">
<p id="preview"></p>
`);
	});

	test('disconnected', () => {
		document.querySelector('input[is]')?.remove();
	});
});

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('data-max-size', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input is="x-file-preview" data-target-for="preview" data-error-message="error" data-max-size="1048576" />
<p id="preview"></p>
`,
		);

		expect(document.body.innerHTML).toBe(`
<input is="x-file-preview" data-target-for="preview" data-error-message="error" data-max-size="1048576" type="file">
<p id="preview"></p>
`);
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
<input is="x-file-preview" data-target-for="preview" data-error-message="error" />
<p id="preview">foo</p>
`,
		);

		const element = document.querySelector('input[is]');
		element?.dispatchEvent(new Event('change'));

		expect(document.body.innerHTML).toBe(`
<input is="x-file-preview" data-target-for="preview" data-error-message="error" type="file">
<p id="preview"></p>
`);
	});
});
