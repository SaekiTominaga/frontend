import { describe, beforeAll, afterAll, test, expect, jest } from '@jest/globals';
import ButtonConfirm from '../dist/ButtonConfirm.js';

customElements.define('x-confirm', ButtonConfirm, {
	extends: 'button',
});

describe('connected & disconnected', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML('beforeend', '<button is="x-confirm" data-message="Message text">Submit</button>');
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('connected', () => {
		expect(document.body.innerHTML).toBe('<button is="x-confirm" data-message="Message text">Submit</button>');
	});

	test('disconnected', () => {
		document.querySelector('input[is="x-clipboard"]')?.remove();
	});
});

describe('click event', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML('beforeend', '<button is="x-confirm" data-message="Message text">Submit</button>');
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('connected', () => {
		const spyConfirm = jest.spyOn(window, 'confirm');
		const element = document.querySelector('button[is="x-confirm"]');
		element.dispatchEvent(new Event('click'));

		expect(spyConfirm).toHaveBeenCalledWith('Message text');
		spyConfirm.mockRestore();
	});
});
