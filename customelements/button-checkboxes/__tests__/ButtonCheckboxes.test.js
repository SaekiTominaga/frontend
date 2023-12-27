import { describe, beforeAll, afterAll, afterEach, test, expect } from '@jest/globals';
import ButtonCheckboxes from '../dist/ButtonCheckboxes.js';

customElements.define('x-checkboxes', ButtonCheckboxes, {
	extends: 'button',
});

describe('connected & disconnected', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button is="x-checkboxes" data-course="check" data-target-for="checkboxes"></button>
<span id="checkboxes">
<input type="checkbox" />
</span>
`,
		);
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('connected', () => {
		expect(document.body.innerHTML).toBe(`
<button is="x-checkboxes" data-course="check" data-target-for="checkboxes" type="button"></button>
<span id="checkboxes">
<input type="checkbox">
</span>
`);
	});

	test('disconnected', () => {
		document.querySelector('button[is="x-checkboxes"]')?.remove();
	});
});

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('data-target-for', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button is="x-checkboxes" data-course="check" data-target-for="checkboxes"></button>
<span id="checkboxes">
<input type="checkbox" />
</span>
`,
		);

		expect(document.body.innerHTML).toBe(`
<button is="x-checkboxes" data-course="check" data-target-for="checkboxes" type="button"></button>
<span id="checkboxes">
<input type="checkbox">
</span>
`);
	});

	test('data-targets-class', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button is="x-checkboxes" data-course="check" data-targets-class="checkbox"></button>
<input type="checkbox" class="checkbox" />
`,
		);

		expect(document.body.innerHTML).toBe(`
<button is="x-checkboxes" data-course="check" data-targets-class="checkbox" type="button"></button>
<input type="checkbox" class="checkbox">
`);
	});

	test('data-targets-name', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button is="x-checkboxes" data-course="check" data-targets-name="checkbox"></button>
<input type="checkbox" name="checkbox" />
`,
		);

		expect(document.body.innerHTML).toBe(`
<button is="x-checkboxes" data-course="check" data-targets-name="checkbox" type="button"></button>
<input type="checkbox" name="checkbox">
`);
	});
});

describe('click', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('data-target-for', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button is="x-checkboxes" data-course="check" data-target-for="checkboxes"></button>
<button is="x-checkboxes" data-course="uncheck" data-target-for="checkboxes"></button>
<span id="checkboxes">
<input type="checkbox" />
<input type="checkbox" checked="" />
<input type="checkbox" />
</span>
`,
		);

		document.querySelector('button[is="x-checkboxes"][data-course="check"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => element.checked)).toBeTruthy();

		document.querySelector('button[is="x-checkboxes"][data-course="uncheck"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => !element.checked)).toBeTruthy();
	});

	test('data-targets-class', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button is="x-checkboxes" data-course="check" data-targets-class="checkbox"></button>
<button is="x-checkboxes" data-course="uncheck" data-targets-class="checkbox"></button>
<input type="checkbox" class="checkbox" />
<input type="checkbox" class="checkbox" checked="" />
<input type="checkbox" class="checkbox" />
`,
		);

		document.querySelector('button[is="x-checkboxes"][data-course="check"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => element.checked)).toBeTruthy();

		document.querySelector('button[is="x-checkboxes"][data-course="uncheck"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => !element.checked)).toBeTruthy();
	});

	test('data-targets-name', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button is="x-checkboxes" data-course="check" data-targets-name="checkbox"></button>
<button is="x-checkboxes" data-course="uncheck" data-targets-name="checkbox"></button>
<input type="checkbox" name="checkbox" />
<input type="checkbox" name="checkbox" checked="" />
<input type="checkbox" name="checkbox" />
`,
		);

		document.querySelector('button[is="x-checkboxes"][data-course="check"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => element.checked)).toBeTruthy();

		document.querySelector('button[is="x-checkboxes"][data-course="uncheck"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => !element.checked)).toBeTruthy();
	});

	test('all attributes', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button is="x-checkboxes" data-course="check" data-target-for="checkboxes" data-targets-class="checkbox" data-targets-name="checkbox"></button>
<button is="x-checkboxes" data-course="uncheck" data-target-for="checkboxes" data-targets-class="checkbox" data-targets-name="checkbox"></button>
<span id="checkboxes">
<input type="checkbox" />
<input type="checkbox" checked="" />
</span>
<input type="checkbox" name="checkbox" />
<input type="checkbox" name="checkbox" checked="" />
<input type="checkbox" class="checkbox" />
<input type="checkbox" class="checkbox" checked="" />
<input type="checkbox" name="checkbox" />
<input type="checkbox" name="checkbox" checked="" />
`,
		);

		document.querySelector('button[is="x-checkboxes"][data-course="check"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => element.checked)).toBeTruthy();

		document.querySelector('button[is="x-checkboxes"][data-course="uncheck"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => !element.checked)).toBeTruthy();
	});
});
