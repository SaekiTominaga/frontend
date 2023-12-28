import { describe, expect, test } from '@jest/globals';
import 'cross-fetch/polyfill';
import ClosestHTMLPage from '../dist/ClosestHTMLPage.js';

describe('fetch', () => {
	test('<title>', async () => {
		const closestHTMLPage = new ClosestHTMLPage();

		await closestHTMLPage.fetch('https://saekitominaga.github.io/closest-html-page/dir1/dir2/file');

		expect(closestHTMLPage.getFetchedResponses().size).toBe(2);
		expect(closestHTMLPage.getUrl()).toBe('https://saekitominaga.github.io/closest-html-page/dir1/');
		expect(closestHTMLPage.getTitle()).toBe('dummy');
	});

	test('OGP', async () => {
		const closestHTMLPage = new ClosestHTMLPage();

		await closestHTMLPage.fetch('https://saekitominaga.github.io/closest-html-page/dir1/');

		expect(closestHTMLPage.getFetchedResponses().size).toBe(1);
		expect(closestHTMLPage.getUrl()).toBe('https://saekitominaga.github.io/closest-html-page/');
		expect(closestHTMLPage.getTitle()).toBe('Get the data of the HTML page of the nearest ancestor hierarchy');
	});
});

describe('maxFetchCount', () => {
	test('over', async () => {
		const closestHTMLPage = new ClosestHTMLPage({ maxFetchCount: 1 });

		await closestHTMLPage.fetch('https://saekitominaga.github.io/closest-html-page/dir1/dir2/file');

		expect(closestHTMLPage.getFetchedResponses().size).toBe(1);
		expect(closestHTMLPage.getUrl()).toBeNull();
		expect(closestHTMLPage.getTitle()).toBeNull();
	});

	test('not integer', async () => {
		expect(() => {
			new ClosestHTMLPage({ maxFetchCount: 1.5 });
		}).toThrow('Argument `maxFetchCount` must be an integer.');
	});

	test('minus', async () => {
		expect(() => {
			new ClosestHTMLPage({ maxFetchCount: -1 });
		}).toThrow('Argument `maxFetchCount` must be greater than or equal to 0.');
	});
});

describe('fetchOptions', () => {
	test('method: head', async () => {
		const closestHTMLPage = new ClosestHTMLPage({ fetchOptions: { method: 'head' } });
		await closestHTMLPage.fetch('https://saekitominaga.github.io/closest-html-page/dir1/dir2/file');

		expect(closestHTMLPage.getFetchedResponses().size).toBe(2);
		expect(closestHTMLPage.getUrl()).toBe('https://saekitominaga.github.io/closest-html-page/dir1/');
		expect(closestHTMLPage.getTitle()).toBeNull();
	});
});

describe('mimeTypes', () => {
	test('no applicable mime type', async () => {
		const closestHTMLPage = new ClosestHTMLPage({ mimeTypes: ['image/svg+xml'] });
		await closestHTMLPage.fetch('https://saekitominaga.github.io/closest-html-page/dir1/');

		expect(closestHTMLPage.getFetchedResponses().size).toBe(2);
		expect(closestHTMLPage.getUrl()).toBeNull();
		expect(closestHTMLPage.getTitle()).toBeNull();
	});
});
