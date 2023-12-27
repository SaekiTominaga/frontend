import { describe, beforeEach, afterEach, test, expect, jest } from '@jest/globals';
import FormSubmitOverlay from '../dist/FormSubmitOverlay.js';

// jsdom が <dialog> 要素をサポートするまでの暫定処理 https://github.com/jsdom/jsdom/issues/3294
HTMLDialogElement.prototype.close = jest.fn();
HTMLDialogElement.prototype.show = jest.fn();
HTMLDialogElement.prototype.showModal = jest.fn();

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no data-overlayed-by', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<form></form>
`,
		);

		const element = document.querySelector('form');

		expect(() => {
			new FormSubmitOverlay(element).init();
		}).toThrow('Attribute: `data-overlayed-by` is not set.');
	});

	test('not exist', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<form data-overlayed-by="overlay"></form>
`,
		);

		const element = document.querySelector('form');

		expect(() => {
			new FormSubmitOverlay(element).init();
		}).toThrow('Element: #overlay can not found.');
	});

	test('not <dialog>', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<form data-overlayed-by="overlay"></form>
<div id="overlay"></div>
`,
		);

		const element = document.querySelector('form');

		expect(() => {
			new FormSubmitOverlay(element).init();
		}).toThrow('Element: #overlay must be a `<dialog>` element.');
	});

	test('<dialog>', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<form data-overlayed-by="overlay"></form>
<dialog id="overlay"></dialog>
`,
		);

		const element = document.querySelector('form');

		new FormSubmitOverlay(element).init();

		expect(document.body.innerHTML).toBe(`
<form data-overlayed-by="overlay"></form>
<dialog id="overlay"></dialog>
`);
	});
});

describe('event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<form data-overlayed-by="overlay"></form>
<dialog id="overlay"></dialog>
`,
		);
	});

	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('submit', () => {
		const element = document.querySelector('form');
		const dialogElement = document.querySelector('dialog');
		const spy = jest.spyOn(dialogElement, 'showModal');

		new FormSubmitOverlay(element).init();

		element?.dispatchEvent(new Event('submit'));

		expect(spy).toHaveBeenCalled();

		spy.mockRestore();
	});

	test('unload', () => {
		const element = document.querySelector('form');
		const dialogElement = document.querySelector('dialog');
		const spy = jest.spyOn(dialogElement, 'close');

		new FormSubmitOverlay(element).init();

		window.dispatchEvent(new Event('unload'));

		expect(spy).toHaveBeenCalled();

		spy.mockRestore();
	});
});
