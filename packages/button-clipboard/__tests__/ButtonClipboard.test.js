import { describe, afterEach, test, expect, jest } from '@jest/globals';
import ButtonClipboard from '../dist/ButtonClipboard.js';

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

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', async () => {
		document.body.insertAdjacentHTML('beforeend', '<button class="js-clipboard">Copy</button>');

		expect(() => {
			new ButtonClipboard(document.querySelector('.js-clipboard'));
		}).toThrow('Attribute: `data-text` or `data-target` is not set.');
	});
});

describe('no element', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no target', async () => {
		document.body.insertAdjacentHTML('beforeend', '<button class="js-clipboard" data-target="clipboard-target">Copy</button>');

		expect(() => {
			new ButtonClipboard(document.querySelector('.js-clipboard'));
		}).toThrow('Element: #clipboard-target can not found.');
	});

	test('no feedback', async () => {
		document.body.insertAdjacentHTML('beforeend', '<button class="js-clipboard" data-text="Text" data-feedback="clipboard-feedback">Copy</button>');

		expect(() => {
			new ButtonClipboard(document.querySelector('.js-clipboard'));
		}).toThrow('Element: #clipboard-feedback can not found.');
	});
});

describe('click event', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('data-text', async () => {
		const spyClipboardWrite = jest.spyOn(navigator.clipboard, 'writeText');
		const spyConsole = jest.spyOn(console, 'info');
		document.body.insertAdjacentHTML('beforeend', '<button class="js-clipboard" data-text="Text">Copy</button>');

		new ButtonClipboard(document.querySelector('.js-clipboard'));

		const element = document.querySelector('.js-clipboard');
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
<button class="js-clipboard" data-target="clipboard-target">Copy</button>
<p id="clipboard-target">Text</p>
`,
		);

		new ButtonClipboard(document.querySelector('.js-clipboard'));

		const element = document.querySelector('.js-clipboard');
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
<button class="js-clipboard" data-text="Text" data-feedback="clipboard-feedback">Copy</button>
<p id="clipboard-feedback" hidden="">Success</p>
`,
		);

		new ButtonClipboard(document.querySelector('.js-clipboard'));

		const element = document.querySelector('.js-clipboard');
		element.dispatchEvent(new Event('click'));
		await sleep(100);

		expect(spyClipboardWrite).toHaveBeenCalledWith('Text');
		expect(document.body.innerHTML).toBe(`
<button class="js-clipboard" data-text="Text" data-feedback="clipboard-feedback">Copy</button>
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
<button class="js-clipboard" data-target="clipboard-target">Copy</button>
<p id="clipboard-target">
  p content
  p content
</p>
`,
		);

		new ButtonClipboard(document.querySelector('.js-clipboard'));

		const element = document.querySelector('.js-clipboard');
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
<button class="js-clipboard" data-target="clipboard-target">Copy</button>
<textarea id="clipboard-target">
  textarea content
  textarea content
</textarea>
`,
		);

		new ButtonClipboard(document.querySelector('.js-clipboard'));

		const element = document.querySelector('.js-clipboard');
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
<button class="js-clipboard" data-target="clipboard-target">Copy</button>
<meta id="clipboard-target" name="meta name" content="  meta content  ">
`,
		);

		new ButtonClipboard(document.querySelector('.js-clipboard'));

		const element = document.querySelector('.js-clipboard');
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
<button class="js-clipboard" data-target="clipboard-target">Copy</button>
<pre id="clipboard-target">
  pre content
  pre content
</pre>
`,
		);

		new ButtonClipboard(document.querySelector('.js-clipboard'));

		const element = document.querySelector('.js-clipboard');
		element.dispatchEvent(new Event('click'));
		await sleep(100);

		expect(spyConsole).toHaveBeenCalled();
		expect(spyConsole.mock.calls[0][1]).toBe(`  pre content
  pre content
`);
		spyConsole.mockRestore();
	});
});
