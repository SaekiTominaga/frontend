import { describe, test } from '@jest/globals';
import ButtonMediaSamePlay from '../dist/ButtonMediaSamePlay.js';

describe('x-media-same-play', () => {
	customElements.define('x-media-same-play', ButtonMediaSamePlay, {
		extends: 'button',
	});

	test('connected & disconnected', () => {
		const fooElement = document.createElement('p');
		fooElement.id = 'foo';
		document.body.appendChild(fooElement);

		const element = document.createElement('button', { is: 'x-media-same-play' });
		element.dataset.targetsFor = 'foo';
		document.body.appendChild(element);
		element.remove();
	});
});
