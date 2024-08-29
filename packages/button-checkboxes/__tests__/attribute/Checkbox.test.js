// @ts-check

import { describe, afterEach, test, expect } from '@jest/globals';
import Checkbox from '../../dist/attribute/Checkbox.js';

describe('constructor', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', () => {
		expect(() => {
			new Checkbox({});
		}).toThrow('The `data-control` or `data-controls-class` or `data-controls-name` attribute is not set.');
	});

	test('all attribute', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button data-course="check"   data-control="checkboxes" data-controls-class="checkbox-class" data-controls-name="checkbox-name"></button>
<button data-course="uncheck" data-control="checkboxes" data-controls-class="checkbox-class" data-controls-name="checkbox-name"></button>

<span id="checkboxes">
<input type="checkbox" id="checkbox1" />
<input type="checkbox" id="checkbox2" checked="" />
</span>

<input type="checkbox" name="checkbox-name" id="checkbox3" />
<input type="checkbox" name="checkbox-name" id="checkbox4" checked="" />

<input type="checkbox" class="checkbox-class" id="checkbox5" />
<input type="checkbox" class="checkbox-class" id="checkbox6" checked="" />
`,
		);

		const checkboxes = new Checkbox({ id: 'checkboxes', class: 'checkbox-class', name: 'checkbox-name' }).elements;

		expect(checkboxes.length).toBe(6);
		expect(checkboxes[0].id).toBe('checkbox1');
		expect(checkboxes[1].id).toBe('checkbox2');
		expect(checkboxes[2].id).toBe('checkbox5');
		expect(checkboxes[3].id).toBe('checkbox6');
		expect(checkboxes[4].id).toBe('checkbox3');
		expect(checkboxes[5].id).toBe('checkbox4');
	});
});

describe('constructor - data-control', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no id', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button data-course="check" data-control="checkboxes"></button>
<span id="checkboxes">
<input type="checkbox" id="checkbox1" />
</span>
`,
		);

		expect(() => {
			new Checkbox({ id: 'xxx' });
		}).toThrow('Element `#xxx` not found.');
	});

	test('no checkbox', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button data-course="check" data-control="checkboxes"></button>
<span id="checkboxes">
</span>
`,
		);

		expect(() => {
			new Checkbox({ id: 'checkboxes' });
		}).toThrow('Checkbox does not exist in descendants of the element `#checkboxes`.');
	});

	test('exist checkboxes', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button data-course="check" data-control="checkboxes"></button>
<span id="checkboxes">
<input type="checkbox" id="checkbox1" />
</span>
`,
		);

		const checkboxes = new Checkbox({ id: 'checkboxes' }).elements;

		expect(checkboxes.length).toBe(1);
		expect(checkboxes[0].id).toBe('checkbox1');
	});
});

describe('constructor - data-controls-class', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no checkbox', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button data-course="check" data-controls-class="checkbox"></button>
<input type="checkbox" class="checkbox" id="checkbox1" />
`,
		);

		expect(() => {
			new Checkbox({ class: 'xxx' });
		}).toThrow('Element `.xxx` not found.');
	});

	test('exist checkboxes', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button data-course="check" data-controls-class="checkbox"></button>
<input type="checkbox" class="checkbox" id="checkbox1" />
`,
		);

		const checkboxes = new Checkbox({ class: 'checkbox' }).elements;

		expect(checkboxes.length).toBe(1);
		expect(checkboxes[0].id).toBe('checkbox1');
	});
});

describe('constructor - data-controls-name', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no checkbox', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button data-course="check" data-controls-name="checkbox"></button>
<input type="checkbox" name="checkbox" id="checkbox1" />
`,
		);

		expect(() => {
			new Checkbox({ name: 'xxx' });
		}).toThrow('Element `[name=xxx]` not found.');
	});

	test('exist checkboxes', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button data-course="check" data-controls-name="checkbox"></button>
<input type="checkbox" name="checkbox" id="checkbox1" />
`,
		);

		const checkboxes = new Checkbox({ name: 'checkbox' }).elements;

		expect(checkboxes.length).toBe(1);
		expect(checkboxes[0].id).toBe('checkbox1');
	});
});
