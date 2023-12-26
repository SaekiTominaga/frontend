import { describe, expect, test } from '@jest/globals';
import HtmlElementText from '../dist/HtmlElementText.js';

describe('getWidth()', () => {
	const element = document.createElement('p');
	document.body.appendChild(element);

	const htmlElementText = new HtmlElementText(element);

	test('empty', () => {
		expect(htmlElementText.getWidth()).toBe(0);
	});

	test('empty (Argument specification)', () => {
		expect(htmlElementText.getWidth('')).toBe(0);
	});
});
