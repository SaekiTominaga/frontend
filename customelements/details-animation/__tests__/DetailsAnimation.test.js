import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import { mockAnimationsApi } from 'jsdom-testing-mocks';
import DetailsAnimation from '../dist/DetailsAnimation.js';

customElements.define('x-animation', DetailsAnimation, {
	extends: 'details',
});

mockAnimationsApi();

const sleep = (ms) =>
	new Promise((callback) => {
		setTimeout(callback, ms);
	});

describe('connected & toggle event & disconnected', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<details is="x-animation">
<summary>Open</summary>
<p></p>
</details>
`,
		);
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('connected', () => {
		expect(document.body.innerHTML).toBe(`
<details is="x-animation" data-pre-open="false">
<summary>Open</summary><div style="overflow: hidden;">
<p></p>
</div></details>
`);
	});

	test('toggle event (open !== preopen)', () => {
		const element = document.querySelector('details[is]');

		element.open = true;

		element.dispatchEvent(new UIEvent('toggle'));

		expect(element.open).toBeTruthy();
		expect(element.dataset.preOpen).toBe('true');
	});

	test('disconnected', () => {
		const element = document.querySelector('details[is]');

		element.remove();
	});
});

describe('open', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<details is="x-animation" data-duration="100" data-easing="linear">
<summary>Open</summary>
</details>
`,
		);
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('summary click', () => {
		const element = document.querySelector('details[is]');
		const summaryElement = element.querySelector('summary');

		summaryElement.dispatchEvent(new UIEvent('click'));

		expect(element.open).toBeTruthy();
		expect(element.dataset.preOpen).toBe('true');
	});

	test('animetion end', async () => {
		const element = document.querySelector('details[is]');

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
<details is="x-animation" open="" data-duration="100" data-easing="linear">
<summary>Open</summary>
</details>
`,
		);
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('summary click', () => {
		const element = document.querySelector('details[is]');
		const summaryElement = element.querySelector('summary');

		summaryElement.dispatchEvent(new UIEvent('click'));

		expect(element.open).toBeTruthy();
		expect(element.dataset.preOpen).toBe('false');
	});

	test('animetion end', async () => {
		const element = document.querySelector('details[is]');

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
<details is="x-animation" data-duration="100">
<summary>Open</summary>
</details>
`,
		);
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('summary click', () => {
		const element = document.querySelector('details[is]');
		const summaryElement = element.querySelector('summary');

		summaryElement.dispatchEvent(new UIEvent('click'));

		expect(element.open).toBeTruthy();
		expect(element.dataset.preOpen).toBe('true');
	});

	test('summary click during animetion', async () => {
		const element = document.querySelector('details[is]');
		const summaryElement = element.querySelector('summary');

		await sleep(50);
		summaryElement.dispatchEvent(new UIEvent('click'));

		expect(element.open).toBeTruthy();
		expect(element.dataset.preOpen).toBe('false');
	});

	test('animetion end', async () => {
		const element = document.querySelector('details[is]');

		await sleep(200);

		expect(element.open).toBeFalsy();
		expect(element.dataset.preOpen).toBe('false');
	});
});

describe('close → open', () => {
	// TODO:
});
