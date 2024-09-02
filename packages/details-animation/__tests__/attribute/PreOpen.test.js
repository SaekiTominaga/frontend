import { describe, beforeAll, test, expect } from '@jest/globals';
import PreOpen from '../../dist/attribute/PreOpen.js';

describe('getter / setter', () => {
	beforeAll(() => {
		document.body.innerHTML = '<details></details>';
	});

	test('state', () => {
		const preOpen = new PreOpen(document.querySelector('details'));

		expect(preOpen.state).toBeFalsy();

		preOpen.state = true;
		expect(preOpen.state).toBeTruthy();

		preOpen.state = false;
		expect(preOpen.state).toBeFalsy();
	});
});

describe('method', () => {
	beforeAll(() => {
		document.body.innerHTML = '<details></details>';
	});

	test('toggle', () => {
		const preOpen = new PreOpen(document.querySelector('details'));

		preOpen.toggle();
		expect(preOpen.state).toBeTruthy();

		preOpen.toggle();
		expect(preOpen.state).toBeFalsy();
	});
});
