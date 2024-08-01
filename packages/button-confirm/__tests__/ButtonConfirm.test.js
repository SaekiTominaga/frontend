import { describe, beforeEach, afterEach, test, expect, jest } from '@jest/globals';
import ButtonConfirm from '../dist/ButtonConfirm.js';

window.confirm = () => {
	/**/
};

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', async () => {
		document.body.insertAdjacentHTML('beforeend', '<button class="js-button-confirm">Submit</button>');

		expect(() => {
			new ButtonConfirm(document.querySelector('.js-button-confirm'));
		}).toThrow('Attribute: `data-message` is not set.');
	});
});

describe('click event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML('beforeend', '<button class="js-button-confirm" data-message="Message text">Submit</button>');
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('data-message', () => {
		const spyConfirm = jest.spyOn(window, 'confirm');

		new ButtonConfirm(document.querySelector('.js-button-confirm'));

		const element = document.querySelector('.js-button-confirm');
		element.dispatchEvent(new Event('click'));

		expect(spyConfirm).toHaveBeenCalledWith('Message text');
		spyConfirm.mockRestore();
	});
});
