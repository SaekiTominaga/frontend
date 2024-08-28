import { describe, beforeAll, afterAll, afterEach, test, expect } from '@jest/globals';
import CustomElementDetailsContent from '../dist/CustomElementDetailsContent.js';

customElements.define('x-details-content', CustomElementDetailsContent);

describe('connected', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML('beforeend', '<x-details-content>text</x-details-content>');
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('connected', () => {
		expect(document.body.innerHTML).toBe('<x-details-content>text</x-details-content>');
	});
});

describe('attributeChanged', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('duration', () => {
		document.body.insertAdjacentHTML('beforeend', '<x-details-content duration="100">text</x-details-content>');
		const element = document.querySelector('x-details-content');

		expect(element.duration).toBe(100);

		element.removeAttribute('duration');

		expect(element.duration).toBeNull();
	});

	test('easing', () => {
		document.body.insertAdjacentHTML('beforeend', '<x-details-content easing="xxx">text</x-details-content>');
		const element = document.querySelector('x-details-content');

		expect(element.easing).toBe('xxx');

		element.removeAttribute('easing');
		expect(element.easing).toBeNull();
	});
});