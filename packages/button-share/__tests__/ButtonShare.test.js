import { describe, afterEach, test, expect } from '@jest/globals';
import ButtonShare from '../dist/ButtonShare.js';

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', async () => {
		document.body.insertAdjacentHTML('beforeend', '<button class="js-button-share">Share</button>');

		new ButtonShare(document.querySelector('.js-button-share'));

		expect(document.body.innerHTML).toBe('<button class="js-button-share" disabled="">Share</button>');
	});

	test('all attribute', async () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<button class="js-button-share" data-text="Message text" data-title="Page title" data-url="/path/to">Share</button>',
		);

		new ButtonShare(document.querySelector('.js-button-share'));

		expect(document.body.innerHTML).toBe(
			'<button class="js-button-share" data-text="Message text" data-title="Page title" data-url="/path/to" disabled="">Share</button>',
		);
	});
});
