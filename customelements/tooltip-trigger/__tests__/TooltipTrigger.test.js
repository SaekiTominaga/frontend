import { describe, beforeAll, afterAll, afterEach, test, expect, jest } from '@jest/globals';
import TooltipTrigger from '../dist/TooltipTrigger.js';

customElements.define('x-tooltip-trigger', TooltipTrigger, {
	extends: 'a',
});

const sleep = (ms) =>
	new Promise((callback) => {
		setTimeout(callback, ms);
	});

beforeAll(() => {
	HTMLDialogElement.prototype.close = jest.fn();
	HTMLDialogElement.prototype.show = jest.fn();
	HTMLDialogElement.prototype.showModal = jest.fn();
}); // jsdom が <dialog> 要素をサポートするまでの暫定処理 https://github.com/jsdom/jsdom/issues/3294

describe('connected & disconnected', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" is="x-tooltip-trigger"></a>
<p id="footnote"></p>
`,
		);
	});
	afterAll(() => {
		document.documentElement.innerHTML = '';
	});

	test('connected', () => {
		expect(document.body.innerHTML).toBe(`
<a href="#footnote" is="x-tooltip-trigger" role="button" aria-controls="tooltip-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
`);
	});

	test('disconnected', () => {
		document.querySelector('a[is]')?.remove();
	});
});

describe('image preload', () => {
	afterEach(() => {
		document.documentElement.innerHTML = '';
	});

	test('no link element', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-close-image-src="close.svg"></a>
<p id="footnote"></p>
`,
		);

		expect(document.documentElement.innerHTML).toBe(`<head><link rel="preload" href="close.svg"></head><body>
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-close-image-src="close.svg" role="button" aria-controls="tooltip-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
</body>`);
	});

	test('data url', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-close-image-src="data:image/svg+xml,base64,..."></a>
<p id="footnote"></p>
`,
		);

		expect(document.documentElement.innerHTML).toBe(`<head></head><body>
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-close-image-src="data:image/svg+xml,base64,..." role="button" aria-controls="tooltip-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
</body>`);
	});

	test('link element already exists', () => {
		document.head.insertAdjacentHTML(
			'beforeend',
			`
<link/>
`,
		);
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-close-image-src="close.svg"></a>
<p id="footnote"></p>
`,
		);

		expect(document.documentElement.innerHTML).toBe(`<head>
<link><link rel="preload" href="close.svg">
</head><body>
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-close-image-src="close.svg" role="button" aria-controls="tooltip-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
</body>`);
	});

	test('link preload already exists', () => {
		document.head.insertAdjacentHTML(
			'beforeend',
			`
<link rel="preload" href="close.svg"/>
`,
		);
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-close-image-src="close.svg"></a>
<p id="footnote"></p>
`,
		);

		expect(document.documentElement.innerHTML).toBe(`<head>
<link rel="preload" href="close.svg">
</head><body>
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-close-image-src="close.svg" role="button" aria-controls="tooltip-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
</body>`);
	});
});

describe('attribute', () => {
	afterEach(() => {
		document.documentElement.innerHTML = '';
	});

	test('Required attributes only', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" is="x-tooltip-trigger"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector('a[is]');

		element?.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" is="x-tooltip-trigger" role="button" aria-controls="tooltip-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-tooltip><span tabindex="0"></span><dialog id="tooltip-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-tooltip>`);
	});

	test('data-tooltip-label', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-label="Label"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector('a[is]');

		element?.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-label="Label" role="button" aria-controls="tooltip-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-tooltip><span tabindex="0"></span><dialog id="tooltip-footnote" tabindex="0" aria-label="Label" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-tooltip>`);
	});

	test('data-tooltip-class', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-class="class"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector('a[is]');

		element?.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-class="class" role="button" aria-controls="tooltip-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-tooltip><span tabindex="0"></span><dialog id="tooltip-footnote" class="class" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-tooltip>`);
	});

	test('data-tooltip-close-text', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-close-text="Tooltip close"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector('a[is]');

		element?.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-close-text="Tooltip close" role="button" aria-controls="tooltip-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-tooltip><span tabindex="0"></span><dialog id="tooltip-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Tooltip close</button></form></dialog><span tabindex="0"></span></x-tooltip>`);
	});

	test('data-tooltip-close-image-src', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-close-image-src="close.svg"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector('a[is]');

		element?.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-close-image-src="close.svg" role="button" aria-controls="tooltip-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-tooltip><span tabindex="0"></span><dialog id="tooltip-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button><img src="close.svg" alt="Close"></button></form></dialog><span tabindex="0"></span></x-tooltip>`);
	});

	test('data-tooltip-mouse*-delay', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-mouseenter-delay="100" data-tooltip-mouseleave-delay="110"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector('a[is]');

		element?.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-mouseenter-delay="100" data-tooltip-mouseleave-delay="110" role="button" aria-controls="tooltip-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-tooltip><span tabindex="0"></span><dialog id="tooltip-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-tooltip>`);
	});

	test('id arribute delete', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-mouseenter-delay="100" data-tooltip-mouseleave-delay="110"></a>
<p id="footnote"><span id="foo">foo</span></p>
`,
		);
		const element = document.querySelector('a[is]');

		element?.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" is="x-tooltip-trigger" data-tooltip-mouseenter-delay="100" data-tooltip-mouseleave-delay="110" role="button" aria-controls="tooltip-footnote" aria-expanded="true"></a>
<p id="footnote"><span id="foo">foo</span></p>
<x-tooltip><span tabindex="0"></span><dialog id="tooltip-footnote" tabindex="0" style="top: 0px; left: 0px;"><span>foo</span><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-tooltip>`);
	});
});

describe('click', () => {
	afterAll(() => {
		document.documentElement.innerHTML = '';
	});

	test('click → show', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" is="x-tooltip-trigger"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector('a[is]');

		element?.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" is="x-tooltip-trigger" role="button" aria-controls="tooltip-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-tooltip><span tabindex="0"></span><dialog id="tooltip-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-tooltip>`);
	});

	test('Escape → hide', async () => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" is="x-tooltip-trigger" role="button" aria-controls="tooltip-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
<x-tooltip hidden=""><span tabindex="0"></span><dialog id="tooltip-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-tooltip>`);
	});
});

describe('close button', () => {
	afterAll(() => {
		document.documentElement.innerHTML = '';
	});

	test('submit', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" is="x-tooltip-trigger"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector('a[is]');

		element?.dispatchEvent(new UIEvent('click'));

		const dialogElement = document.querySelector('x-tooltip dialog');

		dialogElement?.dispatchEvent(new Event('close'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" is="x-tooltip-trigger" role="button" aria-controls="tooltip-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
<x-tooltip hidden=""><span tabindex="0"></span><dialog id="tooltip-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-tooltip>`);
	});
});

describe('mouse', () => {
	afterAll(() => {
		document.documentElement.innerHTML = '';
	});

	test('mouseenter', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" is="x-tooltip-trigger"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector('a[is]');

		element?.dispatchEvent(new MouseEvent('mouseenter'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" is="x-tooltip-trigger" role="button" aria-controls="tooltip-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
`);
	});

	test('show', async () => {
		await sleep(500);

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" is="x-tooltip-trigger" role="button" aria-controls="tooltip-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-tooltip><span tabindex="0"></span><dialog id="tooltip-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-tooltip>`);
	});

	test('mouseleave', async () => {
		const element = document.querySelector('a[is]');

		element?.dispatchEvent(new MouseEvent('mouseleave'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" is="x-tooltip-trigger" role="button" aria-controls="tooltip-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-tooltip><span tabindex="0"></span><dialog id="tooltip-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-tooltip>`);
	});

	test('hide', async () => {
		await sleep(500);

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" is="x-tooltip-trigger" role="button" aria-controls="tooltip-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
<x-tooltip hidden=""><span tabindex="0"></span><dialog id="tooltip-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-tooltip>`);
	});
});

describe('focus', () => {
	// TODO:
});
