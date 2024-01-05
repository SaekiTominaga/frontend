import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect, jest } from '@jest/globals';
import FootnoteReferencePopover from '../dist/FootnoteReferencePopover.js';

const sleep = (ms) =>
	new Promise((callback) => {
		setTimeout(callback, ms);
	});

beforeAll(() => {
	HTMLDialogElement.prototype.close = jest.fn();
	HTMLDialogElement.prototype.show = jest.fn();
	HTMLDialogElement.prototype.showModal = jest.fn();
}); // `jsdom` が `<dialog>` 要素をサポートするまでの暫定処理 https://github.com/jsdom/jsdom/issues/3294

describe('HTML', () => {
	afterEach(() => {
		document.documentElement.innerHTML = '';
	});

	test('no `href` attribute', () => {
		document.body.insertAdjacentHTML('beforeend', '<a class="js-footnote-reference-popover"></a>');

		expect(() => {
			new FootnoteReferencePopover(document.querySelector('.js-footnote-reference-popover'));
		}).toThrow('Attribute: `href` is not set.');
	});

	test('invalid `href` attribute value', () => {
		document.body.insertAdjacentHTML('beforeend', '<a href="/foo" class="js-footnote-reference-popover"></a>');

		expect(() => {
			new FootnoteReferencePopover(document.querySelector('.js-footnote-reference-popover'));
		}).toThrow('Attribute: `href` value must be in the same content.');
	});

	test('no footnote element', () => {
		document.body.insertAdjacentHTML('beforeend', '<a href="#footnote" class="js-footnote-reference-popover"></a>');

		expect(() => {
			new FootnoteReferencePopover(document.querySelector('.js-footnote-reference-popover'));
		}).toThrow('Element: #footnote can not found.');
	});

	test('success', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover"></a>
<p id="footnote"></p>
`,
		);

		new FootnoteReferencePopover(document.querySelector('.js-footnote-reference-popover'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button" aria-controls="popover-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
`);
	});
});

describe('HTML - image preload', () => {
	afterEach(() => {
		document.documentElement.innerHTML = '';
	});

	test('no link element', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-close-image-src="close.svg"></a>
<p id="footnote"></p>
`,
		);

		new FootnoteReferencePopover(document.querySelector('.js-footnote-reference-popover'));

		expect(document.documentElement.innerHTML).toBe(`<head><link rel="preload" href="close.svg"></head><body>
<a href="#footnote" class="js-footnote-reference-popover" data-popover-close-image-src="close.svg" role="button" aria-controls="popover-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
</body>`);
	});

	test('data url', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-close-image-src="data:image/svg+xml,base64,..."></a>
<p id="footnote"></p>
`,
		);

		new FootnoteReferencePopover(document.querySelector('.js-footnote-reference-popover'));

		expect(document.documentElement.innerHTML).toBe(`<head></head><body>
<a href="#footnote" class="js-footnote-reference-popover" data-popover-close-image-src="data:image/svg+xml,base64,..." role="button" aria-controls="popover-footnote" aria-expanded="false"></a>
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
<a href="#footnote" class="js-footnote-reference-popover" data-popover-close-image-src="close.svg"></a>
<p id="footnote"></p>
`,
		);

		new FootnoteReferencePopover(document.querySelector('.js-footnote-reference-popover'));

		expect(document.documentElement.innerHTML).toBe(`<head>
<link><link rel="preload" href="close.svg">
</head><body>
<a href="#footnote" class="js-footnote-reference-popover" data-popover-close-image-src="close.svg" role="button" aria-controls="popover-footnote" aria-expanded="false"></a>
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
<a href="#footnote" class="js-footnote-reference-popover" data-popover-close-image-src="close.svg"></a>
<p id="footnote"></p>
`,
		);

		new FootnoteReferencePopover(document.querySelector('.js-footnote-reference-popover'));

		expect(document.documentElement.innerHTML).toBe(`<head>
<link rel="preload" href="close.svg">
</head><body>
<a href="#footnote" class="js-footnote-reference-popover" data-popover-close-image-src="close.svg" role="button" aria-controls="popover-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
</body>`);
	});
});

describe('click event', () => {
	afterEach(() => {
		document.documentElement.innerHTML = '';
	});

	test('Required attributes only', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector('.js-footnote-reference-popover');

		new FootnoteReferencePopover(element);

		element.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button" aria-controls="popover-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-popover><span tabindex="0"></span><dialog id="popover-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-popover>`);
	});

	test('data-popover-label', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-label="Label"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector('.js-footnote-reference-popover');

		new FootnoteReferencePopover(element);

		element.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-label="Label" role="button" aria-controls="popover-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-popover><span tabindex="0"></span><dialog id="popover-footnote" tabindex="0" aria-label="Label" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-popover>`);
	});

	test('data-popover-class', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-class="class"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector('.js-footnote-reference-popover');

		new FootnoteReferencePopover(element);

		element.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-class="class" role="button" aria-controls="popover-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-popover><span tabindex="0"></span><dialog id="popover-footnote" class="class" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-popover>`);
	});

	test('data-popover-close-text', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-close-text="Popover close"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector('.js-footnote-reference-popover');

		new FootnoteReferencePopover(element);

		element.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-close-text="Popover close" role="button" aria-controls="popover-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-popover><span tabindex="0"></span><dialog id="popover-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Popover close</button></form></dialog><span tabindex="0"></span></x-popover>`);
	});

	test('data-popover-close-image-src', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-close-image-src="close.svg"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector('.js-footnote-reference-popover');

		new FootnoteReferencePopover(element);

		element.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-close-image-src="close.svg" role="button" aria-controls="popover-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-popover><span tabindex="0"></span><dialog id="popover-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button><img src="close.svg" alt="Close"></button></form></dialog><span tabindex="0"></span></x-popover>`);
	});

	test('data-popover-mouse*-delay', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-mouseenter-delay="100" data-popover-mouseleave-delay="110"></a>
<p id="footnote"></p>
`,
		);
		const element = document.querySelector('.js-footnote-reference-popover');

		new FootnoteReferencePopover(element);

		element.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-mouseenter-delay="100" data-popover-mouseleave-delay="110" role="button" aria-controls="popover-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-popover><span tabindex="0"></span><dialog id="popover-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-popover>`);
	});

	test('id arribute delete', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-mouseenter-delay="100" data-popover-mouseleave-delay="110"></a>
<p id="footnote"><span id="foo">foo</span></p>
`,
		);
		const element = document.querySelector('.js-footnote-reference-popover');

		new FootnoteReferencePopover(element);

		element.dispatchEvent(new UIEvent('click'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" data-popover-mouseenter-delay="100" data-popover-mouseleave-delay="110" role="button" aria-controls="popover-footnote" aria-expanded="true"></a>
<p id="footnote"><span id="foo">foo</span></p>
<x-popover><span tabindex="0"></span><dialog id="popover-footnote" tabindex="0" style="top: 0px; left: 0px;"><span>foo</span><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-popover>`);
	});
});

describe('popover hide', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover"></a>
<p id="footnote"></p>
`,
		);

		const element = document.querySelector('.js-footnote-reference-popover');

		new FootnoteReferencePopover(element);

		element.dispatchEvent(new UIEvent('click'));
	});
	afterEach(() => {
		document.documentElement.innerHTML = '';
	});

	test('Escape key', async () => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button" aria-controls="popover-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
<x-popover hidden=""><span tabindex="0"></span><dialog id="popover-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-popover>`);
	});

	test('dialog close event', () => {
		document.querySelector('x-popover dialog').dispatchEvent(new Event('close'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button" aria-controls="popover-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
<x-popover hidden=""><span tabindex="0"></span><dialog id="popover-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-popover>`);
	});
});

describe('mouse', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="js-footnote-reference-popover"></a>
<p id="footnote"></p>
`,
		);

		const element = document.querySelector('.js-footnote-reference-popover');

		new FootnoteReferencePopover(element);
	});
	afterAll(() => {
		document.documentElement.innerHTML = '';
	});

	test('mouseenter', () => {
		document.querySelector('.js-footnote-reference-popover').dispatchEvent(new MouseEvent('mouseenter'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button" aria-controls="popover-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
`);
	});

	test('show', async () => {
		await sleep(500);

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button" aria-controls="popover-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-popover><span tabindex="0"></span><dialog id="popover-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-popover>`);
	});

	test('mouseleave', async () => {
		document.querySelector('.js-footnote-reference-popover').dispatchEvent(new MouseEvent('mouseleave'));

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button" aria-controls="popover-footnote" aria-expanded="true"></a>
<p id="footnote"></p>
<x-popover><span tabindex="0"></span><dialog id="popover-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-popover>`);
	});

	test('hide', async () => {
		await sleep(500);

		expect(document.body.innerHTML).toBe(`
<a href="#footnote" class="js-footnote-reference-popover" role="button" aria-controls="popover-footnote" aria-expanded="false"></a>
<p id="footnote"></p>
<x-popover hidden=""><span tabindex="0"></span><dialog id="popover-footnote" tabindex="0" style="top: 0px; left: 0px;"><form method="dialog"><button>Close</button></form></dialog><span tabindex="0"></span></x-popover>`);
	});
});

describe('focus', () => {
	// TODO:
});
