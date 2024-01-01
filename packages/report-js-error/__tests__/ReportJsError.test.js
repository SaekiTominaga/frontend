import { test, expect, jest } from '@jest/globals';
import ReportJsError from '../dist/ReportJsError.js';

test('正常ケース', () => {
	new ReportJsError('/endpoint').init();
});

test('denyUAs に引っかかる', () => {
	const spyConsole = jest.spyOn(console, 'info');

	new ReportJsError('/endpoint', {
		denyUAs: [/ jsdom\//],
	}).init();

	expect(spyConsole).toHaveBeenCalled();

	spyConsole.mockRestore();
});

test('allowUAs に引っかからない', () => {
	const spyConsole = jest.spyOn(console, 'info');

	new ReportJsError('/endpoint', {
		allowUAs: [/foo/],
	}).init();

	expect(spyConsole).toHaveBeenCalled();

	spyConsole.mockRestore();
});
