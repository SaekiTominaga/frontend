import { describe, test } from '@jest/globals';
import ButtonShare from '../dist/ButtonShare.js';

describe('x-share', () => {
	customElements.define('x-share', ButtonShare, {
		extends: 'button',
	});

	test('connected & disconnected', () => {
		const element = document.createElement('button', { is: 'x-share' });
		element.dataset.shareText = 'text';
		element.dataset.shareTitle = 'title';
		element.dataset.shareUrl = 'https://example.com/';
		document.body.appendChild(element);
		element.remove();
	});
});
