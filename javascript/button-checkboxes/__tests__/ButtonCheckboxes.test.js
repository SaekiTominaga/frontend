import { describe, afterEach, test, expect } from '@jest/globals';
import ButtonCheckboxes from '../dist/ButtonCheckboxes.js';

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('data-control', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-checkboxes-ctrl" data-course="check" data-control="checkboxes"></button>
<span id="checkboxes">
<input type="checkbox" id="checkbox1" />
</span>
`,
		);

		new ButtonCheckboxes(document.querySelector('.js-checkboxes-ctrl'));

		expect(document.body.innerHTML).toBe(`
<button class="js-checkboxes-ctrl" data-course="check" data-control="checkboxes" aria-controls="checkbox1"></button>
<span id="checkboxes">
<input type="checkbox" id="checkbox1">
</span>
`);
	});

	test('data-controls-class', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-checkboxes-ctrl" data-course="check" data-controls-class="checkbox"></button>
<input type="checkbox" class="checkbox" id="checkbox1" />
`,
		);

		new ButtonCheckboxes(document.querySelector('.js-checkboxes-ctrl'));

		expect(document.body.innerHTML).toBe(`
<button class="js-checkboxes-ctrl" data-course="check" data-controls-class="checkbox" aria-controls="checkbox1"></button>
<input type="checkbox" class="checkbox" id="checkbox1">
`);
	});

	test('data-controls-name', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-checkboxes-ctrl" data-course="check" data-controls-name="checkbox"></button>
<input type="checkbox" name="checkbox" id="checkbox1" />
`,
		);

		new ButtonCheckboxes(document.querySelector('.js-checkboxes-ctrl'));

		expect(document.body.innerHTML).toBe(`
<button class="js-checkboxes-ctrl" data-course="check" data-controls-name="checkbox" aria-controls="checkbox1"></button>
<input type="checkbox" name="checkbox" id="checkbox1">
`);
	});

	test('aria-controls', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-checkboxes-ctrl" data-course="check" data-control="checkboxes" aria-controls=""></button>
<span id="checkboxes">
<input type="checkbox" />
</span>
`,
		);

		new ButtonCheckboxes(document.querySelector('.js-checkboxes-ctrl'));

		expect(document.body.innerHTML).toBe(`
<button class="js-checkboxes-ctrl" data-course="check" data-control="checkboxes" aria-controls=""></button>
<span id="checkboxes">
<input type="checkbox">
</span>
`);
	});

	test('no course attribute', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-checkboxes-ctrl"></button>
<input type="checkbox" name="checkbox" id="checkbox1" />
`,
		);

		expect(() => {
			new ButtonCheckboxes(document.querySelector('.js-checkboxes-ctrl'));
		}).toThrow('Attribute: `data-course` is not set.');
	});

	test('invalid value for course attribute', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-checkboxes-ctrl" data-course="foo"></button>
<input type="checkbox" name="checkbox" id="checkbox1" />
`,
		);

		expect(() => {
			new ButtonCheckboxes(document.querySelector('.js-checkboxes-ctrl'));
		}).toThrow("Only 'check' or 'uncheck' can be set for the `data-course` attribute.");
	});

	test('no control attribute', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-checkboxes-ctrl" data-course="check"></button>
<input type="checkbox" name="checkbox" id="checkbox1" />
`,
		);

		expect(() => {
			new ButtonCheckboxes(document.querySelector('.js-checkboxes-ctrl'));
		}).toThrow('Attribute: `data-control` or `data-controls-class` or `data-controls-name` is not set.');
	});
});

describe('click', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('data-control', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-checkboxes-ctrl" data-course="check" data-control="checkboxes"></button>
<button class="js-checkboxes-ctrl" data-course="uncheck" data-control="checkboxes"></button>
<span id="checkboxes">
<input type="checkbox" />
<input type="checkbox" checked="" />
<input type="checkbox" />
</span>
`,
		);

		for (const buttonElement of document.querySelectorAll('.js-checkboxes-ctrl')) {
			new ButtonCheckboxes(buttonElement);
		}

		document.querySelector('.js-checkboxes-ctrl[data-course="check"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => element.checked)).toBeTruthy();

		document.querySelector('.js-checkboxes-ctrl[data-course="uncheck"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => !element.checked)).toBeTruthy();
	});

	test('data-controls-class', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-checkboxes-ctrl" data-course="check" data-controls-class="checkbox"></button>
<button class="js-checkboxes-ctrl" data-course="uncheck" data-controls-class="checkbox"></button>
<input type="checkbox" class="checkbox" />
<input type="checkbox" class="checkbox" checked="" />
<input type="checkbox" class="checkbox" />
`,
		);

		for (const buttonElement of document.querySelectorAll('.js-checkboxes-ctrl')) {
			new ButtonCheckboxes(buttonElement);
		}

		document.querySelector('.js-checkboxes-ctrl[data-course="check"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => element.checked)).toBeTruthy();

		document.querySelector('.js-checkboxes-ctrl[data-course="uncheck"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => !element.checked)).toBeTruthy();
	});

	test('data-controls-name', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-checkboxes-ctrl" data-course="check" data-controls-name="checkbox"></button>
<button class="js-checkboxes-ctrl" data-course="uncheck" data-controls-name="checkbox"></button>
<input type="checkbox" name="checkbox" />
<input type="checkbox" name="checkbox" checked="" />
<input type="checkbox" name="checkbox" />
`,
		);

		for (const buttonElement of document.querySelectorAll('.js-checkboxes-ctrl')) {
			new ButtonCheckboxes(buttonElement);
		}

		document.querySelector('.js-checkboxes-ctrl[data-course="check"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => element.checked)).toBeTruthy();

		document.querySelector('.js-checkboxes-ctrl[data-course="uncheck"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => !element.checked)).toBeTruthy();
	});

	test('all attributes', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-checkboxes-ctrl" data-course="check" data-control="checkboxes" data-controls-class="checkbox" data-controls-name="checkbox"></button>
<button class="js-checkboxes-ctrl" data-course="uncheck" data-control="checkboxes" data-controls-class="checkbox" data-controls-name="checkbox"></button>
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

		for (const buttonElement of document.querySelectorAll('.js-checkboxes-ctrl')) {
			new ButtonCheckboxes(buttonElement);
		}

		document.querySelector('.js-checkboxes-ctrl[data-course="check"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => element.checked)).toBeTruthy();

		document.querySelector('.js-checkboxes-ctrl[data-course="uncheck"]')?.dispatchEvent(new MouseEvent('click'));

		expect(Array.from(document.querySelectorAll('input[type="checkbox"]')).every((element) => !element.checked)).toBeTruthy();
	});
});

describe('no checkbox', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('data-control - no id', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-checkboxes-ctrl" data-course="check" data-control="checkboxes"></button>
`,
		);

		expect(() => {
			new ButtonCheckboxes(document.querySelector('.js-checkboxes-ctrl'));
		}).toThrow('Element: #checkboxes can not found.');
	});

	test('data-control - no checkbox', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-checkboxes-ctrl" data-course="check" data-control="checkboxes"></button>
<span id="checkboxes">
</span>
`,
		);

		expect(() => {
			new ButtonCheckboxes(document.querySelector('.js-checkboxes-ctrl'));
		}).toThrow('Checkbox does not exist in descendants of the Element: #checkboxes.');
	});

	test('data-controls-class', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-checkboxes-ctrl" data-course="check" data-controls-class="checkbox"></button>
`,
		);

		expect(() => {
			new ButtonCheckboxes(document.querySelector('.js-checkboxes-ctrl'));
		}).toThrow('Element: .checkbox can not found.');
	});

	test('data-controls-name', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-checkboxes-ctrl" data-course="check" data-controls-name="checkbox"></button>
`,
		);

		expect(() => {
			new ButtonCheckboxes(document.querySelector('.js-checkboxes-ctrl'));
		}).toThrow('Element: [name=checkbox] can not found.');
	});
});
