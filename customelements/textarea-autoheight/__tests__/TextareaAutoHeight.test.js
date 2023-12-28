import { describe, beforeAll, afterAll, afterEach, test, expect } from '@jest/globals';
import TextareaAutoHeight from '../dist/TextareaAutoHeight.js';

customElements.define('x-auto-height', TextareaAutoHeight, {
	extends: 'textarea',
});

describe('connected & dispatchEvent & disconnected', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<textarea is="x-auto-height"></textarea>
`,
		);
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('connected', () => {
		const element = document.querySelector('textarea[is]');

		expect(element.style.blockSize).toBe('0px');
	});

	test('input event', () => {
		const element = document.querySelector('textarea[is]');

		element.dispatchEvent(new InputEvent('input'));

		expect(element.style.blockSize).toBe('0px');
	});
	test('disconnected', () => {
		const element = document.querySelector('textarea[is]');

		element.remove();
	});
});

describe('box-sizing', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('box-sizing: content-box', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<textarea is="x-auto-height" style="border-top: 2px solid black; border-bottom: 3px solid black;"></textarea>
`,
		);

		const element = document.querySelector('textarea[is]');

		expect(element.style.blockSize).toBe('0px');
	});

	test('box-sizing: border-box', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<textarea is="x-auto-height" style="box-sizing: border-box; border-top: 2px solid black; border-bottom: 3px solid black;"></textarea>
`,
		);

		// expect(element.style.blockSize).toBe('5px'); // TODO: Jest + jsdom は倫理プロパティ未対応?
	});
});

describe('writing-mode', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('writing-mode: vertical-rl', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<textarea is="x-auto-height" style="writing-mode: vertical-rl;"></textarea>
`,
		);
	});
});
