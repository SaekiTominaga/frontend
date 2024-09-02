import { describe, afterEach, test, expect, jest } from '@jest/globals';
import ButtonClipboard from '../dist/ButtonClipboard.js';

Object.assign(navigator, {
	clipboard: {
		writeText: () => {
			/**/
		},
	},
});

const sleep = (ms) =>
	new Promise((callback) => {
		setTimeout(callback, ms);
	});

describe('click event', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('data-text', async () => {
		const spyClipboardWrite = jest.spyOn(navigator.clipboard, 'writeText');
		const spyConsole = jest.spyOn(console, 'info');
		document.body.insertAdjacentHTML('beforeend', '<button data-text="Text">Copy</button>');

		const element = document.querySelector('button');

		new ButtonClipboard(element);

		element.dispatchEvent(new Event('click'));
		await sleep(100);

		expect(spyClipboardWrite).toHaveBeenCalledWith('Text');
		expect(spyConsole).toHaveBeenCalled();
		expect(spyConsole.mock.calls[0][0]).toBe('Clipboard write successfully.');
		spyClipboardWrite.mockRestore();
		spyConsole.mockRestore();
	});

	test('data-target', async () => {
		const spyClipboardWrite = jest.spyOn(navigator.clipboard, 'writeText');
		const spyConsole = jest.spyOn(console, 'info');
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button data-target="target">Copy</button>
<p id="target">Text</p>
`,
		);

		const element = document.querySelector('button');

		new ButtonClipboard(element);

		element.dispatchEvent(new Event('click'));
		await sleep(100);

		expect(spyClipboardWrite).toHaveBeenCalledWith('Text');
		expect(spyConsole).toHaveBeenCalled();
		expect(spyConsole.mock.calls[0][0]).toBe('Clipboard write successfully.');
		spyClipboardWrite.mockRestore();
		spyConsole.mockRestore();
	});

	test('data-feedback', async () => {
		const spyClipboardWrite = jest.spyOn(navigator.clipboard, 'writeText');
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button data-text="Text" data-feedback="feedback">Copy</button>
<p id="feedback" hidden="">Success</p>
`,
		);

		const element = document.querySelector('button');

		new ButtonClipboard(element);

		element.dispatchEvent(new Event('click'));
		await sleep(100);

		expect(spyClipboardWrite).toHaveBeenCalledWith('Text');
		expect(document.querySelector('#feedback').hidden).toBeFalsy();
		spyClipboardWrite.mockRestore();
	});
});
