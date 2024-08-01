import { describe, beforeAll, afterAll, afterEach, test, expect } from '@jest/globals';
import TextareaAutoSize from '../dist/TextareaAutoSize.js';

describe('HTML', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('success', () => {
		document.body.insertAdjacentHTML('beforeend', '<textarea class="js-textarea-auto-size"></textarea>');

		new TextareaAutoSize(document.querySelector('.js-textarea-auto-size'));

		expect(document.body.innerHTML).toBe('<textarea class="js-textarea-auto-size" style="block-size: 0px;"></textarea>');
	});
});

describe('size', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML('beforeend', '<textarea class="js-textarea-auto-size"></textarea>');

		new TextareaAutoSize(document.querySelector('.js-textarea-auto-size'));
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('load', () => {
		const element = document.querySelector('.js-textarea-auto-size');

		expect(element.style.blockSize).toBe('0px');
	});

	test('input event', () => {
		const element = document.querySelector('.js-textarea-auto-size');

		element.dispatchEvent(new InputEvent('input'));

		expect(element.style.blockSize).toBe('0px');
	});
});

describe('box-sizing', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('box-sizing: content-box', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<textarea class="js-textarea-auto-size" style="border-top: 2px solid black; border-bottom: 3px solid black;"></textarea>',
		);

		const element = document.querySelector('.js-textarea-auto-size');

		new TextareaAutoSize(element);

		expect(element.style.blockSize).toBe('0px');
	});

	test('box-sizing: border-box', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<textarea class="js-textarea-auto-size" style="box-sizing: border-box; border-top: 2px solid black; border-bottom: 3px solid black;"></textarea>',
		);

		const element = document.querySelector('.js-textarea-auto-size');

		new TextareaAutoSize(element);

		/*
		expect(element.style.blockSize).toBe('5px'); // TODO: Jest + jsdom は倫理プロパティ未対応?
		*/
	});
});

describe('writing-mode', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('writing-mode: vertical-rl', () => {
		document.body.insertAdjacentHTML('beforeend', '<textarea class="js-textarea-auto-size" style="writing-mode: vertical-rl;"></textarea>');

		const element = document.querySelector('.js-textarea-auto-size');

		new TextareaAutoSize(element);

		expect(element.style.blockSize).toBe('0px');
	});
});
