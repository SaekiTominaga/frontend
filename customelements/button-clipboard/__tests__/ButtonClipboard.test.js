import { describe, beforeAll, afterAll, afterEach, test, expect, jest } from '@jest/globals';
import ButtonClipboard from '../dist/ButtonClipboard.js';

customElements.define('x-clipboard', ButtonClipboard, {
	extends: 'button',
});

Object.assign(navigator, {
	clipboard: {
		writeText: () => {
			//
		},
	},
});

const sleep = (ms) =>
	new Promise((callback) => {
		setTimeout(callback, ms);
	});

describe('connected & disconnected', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML('beforeend', '<button type="button" is="x-clipboard" data-text="Text">Copy</button>');
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('connected', () => {
		expect(document.body.innerHTML).toBe('<button type="button" is="x-clipboard" data-text="Text">Copy</button>');
	});

	test('disconnected', () => {
		document.querySelector('input[is="x-clipboard"]')?.remove();
	});
});

describe('click event', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('data-text', async () => {
		const spyClipboardWrite = jest.spyOn(navigator.clipboard, 'writeText');
		const spyConsole = jest.spyOn(console, 'info');
		document.body.insertAdjacentHTML('beforeend', '<button type="button" is="x-clipboard" data-text="Text">Copy</button>');

		const element = document.querySelector('button[is="x-clipboard"]');
		element.dispatchEvent(new Event('click'));
		await sleep(100);

		expect(spyClipboardWrite).toHaveBeenCalledWith('Text');
		expect(spyConsole).toHaveBeenCalled();
		expect(spyConsole.mock.calls[0][0]).toBe('Clipboard write successfully.');
		spyClipboardWrite.mockRestore();
		spyConsole.mockRestore();
	});

	test('data-target-for', async () => {
		const spyClipboardWrite = jest.spyOn(navigator.clipboard, 'writeText');
		const spyConsole = jest.spyOn(console, 'info');
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button type="button" is="x-clipboard" data-target-for="clipboard-target">Copy</button>
<p id="clipboard-target">Text</p>
`,
		);

		const element = document.querySelector('button[is="x-clipboard"]');
		element.dispatchEvent(new Event('click'));
		await sleep(100);

		expect(spyClipboardWrite).toHaveBeenCalledWith('Text');
		expect(spyConsole).toHaveBeenCalled();
		expect(spyConsole.mock.calls[0][0]).toBe('Clipboard write successfully.');
		spyClipboardWrite.mockRestore();
		spyConsole.mockRestore();
	});

	test('data-feedback-for', async () => {
		const spyClipboardWrite = jest.spyOn(navigator.clipboard, 'writeText');
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button type="button" is="x-clipboard" data-text="Text" data-feedback-for="clipboard-feedback">Copy</button>
<p id="clipboard-feedback" hidden="">Success</p>
`,
		);

		const element = document.querySelector('button[is="x-clipboard"]');
		element.dispatchEvent(new Event('click'));
		await sleep(100);

		expect(spyClipboardWrite).toHaveBeenCalledWith('Text');
		expect(document.body.innerHTML).toBe(`
<button type="button" is="x-clipboard" data-text="Text" data-feedback-for="clipboard-feedback">Copy</button>
<p id="clipboard-feedback">Success</p>
`);
		spyClipboardWrite.mockRestore();
	});
});

describe('HTML element', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('<p>', async () => {
		const spyConsole = jest.spyOn(console, 'info');
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button type="button" is="x-clipboard" data-target-for="clipboard-target">Copy</button>
<p id="clipboard-target">
  p content
  p content
</p>
`,
		);

		const element = document.querySelector('button[is="x-clipboard"]');
		element.dispatchEvent(new Event('click'));
		await sleep(100);

		expect(spyConsole).toHaveBeenCalled();
		expect(spyConsole.mock.calls[0][1]).toBe(`p content
  p content`);
		spyConsole.mockRestore();
	});

	test('<textarea>', async () => {
		const spyConsole = jest.spyOn(console, 'info');
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button type="button" is="x-clipboard" data-target-for="clipboard-target">Copy</button>
<textarea id="clipboard-target">
  textarea content
  textarea content
</textarea>
`,
		);

		const element = document.querySelector('button[is="x-clipboard"]');
		element.dispatchEvent(new Event('click'));
		await sleep(100);

		expect(spyConsole).toHaveBeenCalled();
		expect(spyConsole.mock.calls[0][1]).toBe(`  textarea content
  textarea content
`);
		spyConsole.mockRestore();
	});

	test('<meta>', async () => {
		const spyConsole = jest.spyOn(console, 'info');
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button type="button" is="x-clipboard" data-target-for="clipboard-target">Copy</button>
<meta id="clipboard-target" name="meta name" content="  meta content  ">
`,
		);

		const element = document.querySelector('button[is="x-clipboard"]');
		element.dispatchEvent(new Event('click'));
		await sleep(100);

		expect(spyConsole).toHaveBeenCalled();
		expect(spyConsole.mock.calls[0][1]).toBe('  meta content  ');
		spyConsole.mockRestore();
	});

	test('<pre>', async () => {
		const spyConsole = jest.spyOn(console, 'info');
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button type="button" is="x-clipboard" data-target-for="clipboard-target">Copy</button>
<pre id="clipboard-target">
  pre content
  pre content
</pre>
`,
		);

		const element = document.querySelector('button[is="x-clipboard"]');
		element.dispatchEvent(new Event('click'));
		await sleep(100);

		expect(spyConsole).toHaveBeenCalled();
		expect(spyConsole.mock.calls[0][1]).toBe(`  pre content
  pre content
`);
		spyConsole.mockRestore();
	});
});
