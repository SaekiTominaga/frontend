import { describe, afterEach, test, expect } from '@jest/globals';
import ButtonMediaSamePlay from '../dist/ButtonMediaSamePlay.js';

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', async () => {
		document.body.insertAdjacentHTML('beforeend', '<button class="js-media-same-play">Simultaneous playback</button>');

		expect(() => {
			new ButtonMediaSamePlay(document.querySelector('.js-media-same-play'));
		}).toThrow('Attribute: `aria-controls` is not set.');
	});

	test('all attribute', async () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-media-same-play" aria-controls="video1 video2">Simultaneous playback</button>
<video id="video1"></video>
<video id="video2"></video>
`,
		);

		new ButtonMediaSamePlay(document.querySelector('.js-media-same-play'));

		expect(document.body.innerHTML).toBe(`
<button class="js-media-same-play" aria-controls="video1 video2">Simultaneous playback</button>
<video id="video1"></video>
<video id="video2"></video>
`);
	});
});

describe('no element', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no target', async () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button class="js-media-same-play" aria-controls="video1 video2">Simultaneous playback</button>
<video id="video1"></video>
`,
		);

		expect(() => {
			new ButtonMediaSamePlay(document.querySelector('.js-media-same-play'));
		}).toThrow('Element: #video2 can not found.');
	});
});
