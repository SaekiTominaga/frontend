import { describe, beforeAll, afterAll, afterEach, test, expect } from '@jest/globals';
import { mockAnimationsApi } from 'jsdom-testing-mocks';
import DetailsAnimation from '../dist/DetailsAnimation.js';

mockAnimationsApi();

const sleep = (ms) =>
	new Promise((callback) => {
		setTimeout(callback, ms);
	});

describe('element', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no <summary>', () => {
		document.body.insertAdjacentHTML('beforeend', '<details class="js-details-animation"></details>');

		expect(() => {
			new DetailsAnimation(document.querySelector('.js-details-animation'));
		}).toThrow('Element `<details>` is missing a required instance of child element `<summary>`.');
	});
});

describe('toggle event', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<details class="js-details-animation">
<summary>Open</summary>
<p></p>
</details>
`,
		);

		new DetailsAnimation(document.querySelector('.js-details-animation'));
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('load', () => {
		expect(document.body.innerHTML).toBe(`
<details class="js-details-animation" data-pre-open="false">
<summary>Open</summary><x-details-content>
<p></p>
</x-details-content></details>
`);
	});

	test('toggle event (open !== preopen)', () => {
		const element = document.querySelector('.js-details-animation');

		element.open = true;

		element.dispatchEvent(new UIEvent('toggle'));

		expect(element.open).toBeTruthy();
		expect(element.dataset.preOpen).toBe('true');
	});
});

describe('open', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<details class="js-details-animation" data-duration="100" data-easing="linear">
<summary>Open</summary>
</details>
`,
		);

		new DetailsAnimation(document.querySelector('.js-details-animation'));
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('summary click', () => {
		const element = document.querySelector('.js-details-animation');
		const summaryElement = element.querySelector('summary');

		summaryElement.dispatchEvent(new UIEvent('click'));

		expect(element.open).toBeTruthy();
		expect(element.dataset.preOpen).toBe('true');
	});

	test('animetion end', async () => {
		const element = document.querySelector('.js-details-animation');

		await sleep(200);

		expect(element.open).toBeTruthy();
		expect(element.dataset.preOpen).toBe('true');
	});
});

describe('close', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<details class="js-details-animation" open="" data-duration="100" data-easing="linear">
<summary>Open</summary>
</details>
`,
		);

		new DetailsAnimation(document.querySelector('.js-details-animation'));
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('summary click', () => {
		const element = document.querySelector('.js-details-animation');
		const summaryElement = element.querySelector('summary');

		summaryElement.dispatchEvent(new UIEvent('click'));

		expect(element.open).toBeTruthy();
		expect(element.dataset.preOpen).toBe('false');
	});

	test('animetion end', async () => {
		const element = document.querySelector('.js-details-animation');

		await sleep(200);

		expect(element.open).toBeFalsy();
		expect(element.dataset.preOpen).toBe('false');
	});
});

describe('open → close', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<details class="js-details-animation" data-duration="100">
<summary>Open</summary>
</details>
`,
		);

		new DetailsAnimation(document.querySelector('.js-details-animation'));
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('summary click', () => {
		const element = document.querySelector('.js-details-animation');
		const summaryElement = element.querySelector('summary');

		summaryElement.dispatchEvent(new UIEvent('click'));

		expect(element.open).toBeTruthy();
		expect(element.dataset.preOpen).toBe('true');
	});

	test('summary click during animetion', async () => {
		const element = document.querySelector('.js-details-animation');
		const summaryElement = element.querySelector('summary');

		await sleep(50);
		summaryElement.dispatchEvent(new UIEvent('click'));

		expect(element.open).toBeTruthy();
		expect(element.dataset.preOpen).toBe('false');
	});

	test('animetion end', async () => {
		const element = document.querySelector('.js-details-animation');

		await sleep(200);

		expect(element.open).toBeFalsy();
		expect(element.dataset.preOpen).toBe('false');
	});
});

describe('close → open', () => {
	/* TODO: */
});
