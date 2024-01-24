import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect } from '@jest/globals';
import Tab from '../dist/Tab.js';

customElements.define('x-tab', Tab);

describe('connected & disconnected', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<x-tab>
<a href="#tabpanel1" slot="tab">Tab 1</a>
<a href="#tabpanel2" slot="tab">Tab 2</a>
<div slot="tabpanel" id="tabpanel1">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2">Tab panel 2</div>
</x-tab>
`,
		);
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('connected', () => {
		expect(document.body.innerHTML).toBe(`
<x-tab>
<a slot="tab" id="79655058-e0b7-5fa8-a078-d88ba383f0b6" role="tab" aria-controls="tabpanel1" tabindex="0" aria-selected="true" aria-expanded="true">Tab 1</a>
<a slot="tab" id="783da683-a845-51fe-a561-94cbe0ed12c2" role="tab" aria-controls="tabpanel2" tabindex="-1" aria-selected="false" aria-expanded="false">Tab 2</a>
<div slot="tabpanel" id="tabpanel1" role="tabpanel" aria-labelledby="79655058-e0b7-5fa8-a078-d88ba383f0b6" aria-hidden="false">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2" role="tabpanel" aria-labelledby="783da683-a845-51fe-a561-94cbe0ed12c2" aria-hidden="true">Tab panel 2</div>
</x-tab>
`);
	});

	test('disconnected', () => {
		document.querySelector('x-tab')?.remove();
	});
});

describe('attributes - load', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('tablist-label', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<x-tab tablist-label="label">
<a href="#tabpanel1" slot="tab">Tab 1</a>
<a href="#tabpanel2" slot="tab">Tab 2</a>
<div slot="tabpanel" id="tabpanel1">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2">Tab panel 2</div>
</x-tab>
`,
		);

		expect(document.body.innerHTML).toBe(`
<x-tab tablist-label="label">
<a slot="tab" id="79655058-e0b7-5fa8-a078-d88ba383f0b6" role="tab" aria-controls="tabpanel1" tabindex="0" aria-selected="true" aria-expanded="true">Tab 1</a>
<a slot="tab" id="783da683-a845-51fe-a561-94cbe0ed12c2" role="tab" aria-controls="tabpanel2" tabindex="-1" aria-selected="false" aria-expanded="false">Tab 2</a>
<div slot="tabpanel" id="tabpanel1" role="tabpanel" aria-labelledby="79655058-e0b7-5fa8-a078-d88ba383f0b6" aria-hidden="false">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2" role="tabpanel" aria-labelledby="783da683-a845-51fe-a561-94cbe0ed12c2" aria-hidden="true">Tab panel 2</div>
</x-tab>
`);
	});

	test('storage-key', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<x-tab storage-key="foo">
<a href="#tabpanel1" slot="tab">Tab 1</a>
<a href="#tabpanel2" slot="tab">Tab 2</a>
<div slot="tabpanel" id="tabpanel1">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2">Tab panel 2</div>
</x-tab>
`,
		);

		expect(document.body.innerHTML).toBe(`
<x-tab storage-key="foo">
<a slot="tab" id="79655058-e0b7-5fa8-a078-d88ba383f0b6" role="tab" aria-controls="tabpanel1" tabindex="0" aria-selected="true" aria-expanded="true">Tab 1</a>
<a slot="tab" id="783da683-a845-51fe-a561-94cbe0ed12c2" role="tab" aria-controls="tabpanel2" tabindex="-1" aria-selected="false" aria-expanded="false">Tab 2</a>
<div slot="tabpanel" id="tabpanel1" role="tabpanel" aria-labelledby="79655058-e0b7-5fa8-a078-d88ba383f0b6" aria-hidden="false">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2" role="tabpanel" aria-labelledby="783da683-a845-51fe-a561-94cbe0ed12c2" aria-hidden="true">Tab panel 2</div>
</x-tab>
`);
	});
});

describe('attributes - get / set', () => {
	test('tablist-label', () => {
		const tab = new Tab();

		expect(tab.tablistLabel).toBeNull();
		tab.tablistLabel = 'label';
		expect(tab.tablistLabel).toBe('label');
		tab.tablistLabel = null;
		expect(tab.tablistLabel).toBeNull();
	});

	test('storage-key', () => {
		const tab = new Tab();

		expect(tab.storageKey).toBeNull();
		tab.storageKey = 'foo';
		expect(tab.storageKey).toBe('foo');
		tab.storageKey = null;
		expect(tab.storageKey).toBeNull();
	});
});

describe('tab event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<x-tab>
<a href="#tabpanel1" slot="tab">Tab 1</a>
<a href="#tabpanel2" slot="tab">Tab 2</a>
<a href="#tabpanel3" slot="tab">Tab 3</a>
<div slot="tabpanel" id="tabpanel1">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2">Tab panel 2</div>
<div slot="tabpanel" id="tabpanel3">Tab panel 3</div>
</x-tab>
`,
		);
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('click', () => {
		document.querySelector('[role="tab"]:nth-child(2)')?.dispatchEvent(new MouseEvent('click'));

		expect(document.body.innerHTML).toBe(`
<x-tab>
<a slot="tab" id="79655058-e0b7-5fa8-a078-d88ba383f0b6" role="tab" aria-controls="tabpanel1" tabindex="-1" aria-selected="false" aria-expanded="false">Tab 1</a>
<a slot="tab" id="783da683-a845-51fe-a561-94cbe0ed12c2" role="tab" aria-controls="tabpanel2" tabindex="0" aria-selected="true" aria-expanded="true">Tab 2</a>
<a slot="tab" id="87808b14-2b18-5e4c-b16c-f0f5eeb5d5e1" role="tab" aria-controls="tabpanel3" tabindex="-1" aria-selected="false" aria-expanded="false">Tab 3</a>
<div slot="tabpanel" id="tabpanel1" role="tabpanel" aria-labelledby="79655058-e0b7-5fa8-a078-d88ba383f0b6" aria-hidden="true">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2" role="tabpanel" aria-labelledby="783da683-a845-51fe-a561-94cbe0ed12c2" aria-hidden="false">Tab panel 2</div>
<div slot="tabpanel" id="tabpanel3" role="tabpanel" aria-labelledby="87808b14-2b18-5e4c-b16c-f0f5eeb5d5e1" aria-hidden="true">Tab panel 3</div>
</x-tab>
`);
	});

	test('keydown ←', () => {
		document.querySelector('[role="tab"]:nth-child(1)')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

		expect(document.body.innerHTML).toBe(`
<x-tab>
<a slot="tab" id="79655058-e0b7-5fa8-a078-d88ba383f0b6" role="tab" aria-controls="tabpanel1" tabindex="-1" aria-selected="false" aria-expanded="false">Tab 1</a>
<a slot="tab" id="783da683-a845-51fe-a561-94cbe0ed12c2" role="tab" aria-controls="tabpanel2" tabindex="-1" aria-selected="false" aria-expanded="false">Tab 2</a>
<a slot="tab" id="87808b14-2b18-5e4c-b16c-f0f5eeb5d5e1" role="tab" aria-controls="tabpanel3" tabindex="0" aria-selected="true" aria-expanded="true">Tab 3</a>
<div slot="tabpanel" id="tabpanel1" role="tabpanel" aria-labelledby="79655058-e0b7-5fa8-a078-d88ba383f0b6" aria-hidden="true">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2" role="tabpanel" aria-labelledby="783da683-a845-51fe-a561-94cbe0ed12c2" aria-hidden="true">Tab panel 2</div>
<div slot="tabpanel" id="tabpanel3" role="tabpanel" aria-labelledby="87808b14-2b18-5e4c-b16c-f0f5eeb5d5e1" aria-hidden="false">Tab panel 3</div>
</x-tab>
`);
	});

	test('keydown →', () => {
		document.querySelector('[role="tab"]:nth-child(1)')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

		expect(document.body.innerHTML).toBe(`
<x-tab>
<a slot="tab" id="79655058-e0b7-5fa8-a078-d88ba383f0b6" role="tab" aria-controls="tabpanel1" tabindex="-1" aria-selected="false" aria-expanded="false">Tab 1</a>
<a slot="tab" id="783da683-a845-51fe-a561-94cbe0ed12c2" role="tab" aria-controls="tabpanel2" tabindex="0" aria-selected="true" aria-expanded="true">Tab 2</a>
<a slot="tab" id="87808b14-2b18-5e4c-b16c-f0f5eeb5d5e1" role="tab" aria-controls="tabpanel3" tabindex="-1" aria-selected="false" aria-expanded="false">Tab 3</a>
<div slot="tabpanel" id="tabpanel1" role="tabpanel" aria-labelledby="79655058-e0b7-5fa8-a078-d88ba383f0b6" aria-hidden="true">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2" role="tabpanel" aria-labelledby="783da683-a845-51fe-a561-94cbe0ed12c2" aria-hidden="false">Tab panel 2</div>
<div slot="tabpanel" id="tabpanel3" role="tabpanel" aria-labelledby="87808b14-2b18-5e4c-b16c-f0f5eeb5d5e1" aria-hidden="true">Tab panel 3</div>
</x-tab>
`);
	});

	test('keydown End', () => {
		document.querySelector('[role="tab"]:nth-child(1)')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

		expect(document.body.innerHTML).toBe(`
<x-tab>
<a slot="tab" id="79655058-e0b7-5fa8-a078-d88ba383f0b6" role="tab" aria-controls="tabpanel1" tabindex="-1" aria-selected="false" aria-expanded="false">Tab 1</a>
<a slot="tab" id="783da683-a845-51fe-a561-94cbe0ed12c2" role="tab" aria-controls="tabpanel2" tabindex="-1" aria-selected="false" aria-expanded="false">Tab 2</a>
<a slot="tab" id="87808b14-2b18-5e4c-b16c-f0f5eeb5d5e1" role="tab" aria-controls="tabpanel3" tabindex="0" aria-selected="true" aria-expanded="true">Tab 3</a>
<div slot="tabpanel" id="tabpanel1" role="tabpanel" aria-labelledby="79655058-e0b7-5fa8-a078-d88ba383f0b6" aria-hidden="true">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2" role="tabpanel" aria-labelledby="783da683-a845-51fe-a561-94cbe0ed12c2" aria-hidden="true">Tab panel 2</div>
<div slot="tabpanel" id="tabpanel3" role="tabpanel" aria-labelledby="87808b14-2b18-5e4c-b16c-f0f5eeb5d5e1" aria-hidden="false">Tab panel 3</div>
</x-tab>
`);
	});

	test('keydown Home', () => {
		document.querySelector('[role="tab"]:nth-child(1)')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
		document.querySelector('[role="tab"]:nth-child(3)')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));

		expect(document.body.innerHTML).toBe(`
<x-tab>
<a slot="tab" id="79655058-e0b7-5fa8-a078-d88ba383f0b6" role="tab" aria-controls="tabpanel1" tabindex="0" aria-selected="true" aria-expanded="true">Tab 1</a>
<a slot="tab" id="783da683-a845-51fe-a561-94cbe0ed12c2" role="tab" aria-controls="tabpanel2" tabindex="-1" aria-selected="false" aria-expanded="false">Tab 2</a>
<a slot="tab" id="87808b14-2b18-5e4c-b16c-f0f5eeb5d5e1" role="tab" aria-controls="tabpanel3" tabindex="-1" aria-selected="false" aria-expanded="false">Tab 3</a>
<div slot="tabpanel" id="tabpanel1" role="tabpanel" aria-labelledby="79655058-e0b7-5fa8-a078-d88ba383f0b6" aria-hidden="false">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2" role="tabpanel" aria-labelledby="783da683-a845-51fe-a561-94cbe0ed12c2" aria-hidden="true">Tab panel 2</div>
<div slot="tabpanel" id="tabpanel3" role="tabpanel" aria-labelledby="87808b14-2b18-5e4c-b16c-f0f5eeb5d5e1" aria-hidden="true">Tab panel 3</div>
</x-tab>
`);
	});
});

describe('tabpanel event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<x-tab>
<a href="#tabpanel1" slot="tab">Tab 1</a>
<a href="#tabpanel2" slot="tab">Tab 2</a>
<a href="#tabpanel3" slot="tab">Tab 3</a>
<div slot="tabpanel" id="tabpanel1">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2">Tab panel 2</div>
<div slot="tabpanel" id="tabpanel3">Tab panel 3</div>
</x-tab>
`,
		);
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('keydown ←', () => {
		document.querySelector('#tabpanel1')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', ctrlKey: true }));

		expect(document.body.innerHTML).toBe(`
<x-tab>
<a slot="tab" id="79655058-e0b7-5fa8-a078-d88ba383f0b6" role="tab" aria-controls="tabpanel1" tabindex="0" aria-selected="true" aria-expanded="true">Tab 1</a>
<a slot="tab" id="783da683-a845-51fe-a561-94cbe0ed12c2" role="tab" aria-controls="tabpanel2" tabindex="-1" aria-selected="false" aria-expanded="false">Tab 2</a>
<a slot="tab" id="87808b14-2b18-5e4c-b16c-f0f5eeb5d5e1" role="tab" aria-controls="tabpanel3" tabindex="-1" aria-selected="false" aria-expanded="false">Tab 3</a>
<div slot="tabpanel" id="tabpanel1" role="tabpanel" aria-labelledby="79655058-e0b7-5fa8-a078-d88ba383f0b6" aria-hidden="false">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2" role="tabpanel" aria-labelledby="783da683-a845-51fe-a561-94cbe0ed12c2" aria-hidden="true">Tab panel 2</div>
<div slot="tabpanel" id="tabpanel3" role="tabpanel" aria-labelledby="87808b14-2b18-5e4c-b16c-f0f5eeb5d5e1" aria-hidden="true">Tab panel 3</div>
</x-tab>
`);
	});
});
