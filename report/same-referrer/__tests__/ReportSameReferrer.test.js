import { describe, beforeAll, test, expect, jest } from '@jest/globals';
import ReportSameReferrer from '../dist/ReportSameReferrer.js';

describe('no referrer', () => {
	test('何もせず終了', async () => {
		await new ReportSameReferrer('/endpoint').report();
	});
});

describe('condition', () => {
	test('origin', async () => {
		Object.defineProperty(document, 'referrer', { value: 'https://localhost/', configurable: true });

		await new ReportSameReferrer('/endpoint', { condition: 'origin' }).report();
	});

	test('host', async () => {
		Object.defineProperty(document, 'referrer', { value: 'http://localhost:999/', configurable: true });

		await new ReportSameReferrer('/endpoint', { condition: 'host' }).report();
	});

	test('hostname', async () => {
		Object.defineProperty(document, 'referrer', { value: 'http://example.com/', configurable: true });

		await new ReportSameReferrer('/endpoint', { condition: 'hostname' }).report();
	});

	test('invalid', async () => {
		try {
			Object.defineProperty(document, 'referrer', { value: 'http://example.com/', configurable: true });

			await new ReportSameReferrer('/endpoint', { condition: 'foo' }).report();
		} catch (e) {
			expect(e.message).toMatch('An invalid value was specified for the argument `condition`.');
		}
	});
});

describe('same', () => {
	test('origin', async () => {
		Object.defineProperty(document, 'referrer', { value: 'https://localhost/', configurable: true });

		await new ReportSameReferrer('/endpoint', { condition: 'origin', same: ['http://localhost'] }).report();
	});

	test('host', async () => {
		Object.defineProperty(document, 'referrer', { value: 'http://localhost:999/', configurable: true });

		await new ReportSameReferrer('/endpoint', { condition: 'host', same: ['localhost:1000'] }).report();
	});

	test('hostname', async () => {
		Object.defineProperty(document, 'referrer', { value: 'http://example.com/', configurable: true });

		await new ReportSameReferrer('/endpoint', { condition: 'hostname', same: ['example.net'] }).report();
	});
});

describe('user agent', () => {
	beforeAll(async () => {
		Object.defineProperty(document, 'referrer', { value: 'http://example.com/', configurable: true });
	});

	test('denyUAs', async () => {
		const spyConsole = jest.spyOn(console, 'info');

		await new ReportSameReferrer('/endpoint', {
			denyUAs: [/ jsdom\//],
		}).report();

		expect(spyConsole).toHaveBeenCalled();

		spyConsole.mockRestore();
	});

	test('allowUAs', async () => {
		const spyConsole = jest.spyOn(console, 'info');

		await new ReportSameReferrer('/endpoint', {
			allowUAs: [/foo/],
		}).report();

		expect(spyConsole).toHaveBeenCalled();

		spyConsole.mockRestore();
	});
});
