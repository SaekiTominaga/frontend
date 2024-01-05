import { describe, afterEach, test, expect } from '@jest/globals';
import HTMLElementUtil from '../dist/HTMLElementUtil.js';

describe('getContent()', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('<p>', async () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<p id="element">
  p content
  p content
</p>
`,
		);

		expect(new HTMLElementUtil(document.querySelector('#element')).getContent()).toBe(`p content
  p content`);
	});

	test('<textarea>', async () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<textarea id="element">
  textarea content
  textarea content
</textarea>
`,
		);

		expect(new HTMLElementUtil(document.querySelector('#element')).getContent()).toBe(`  textarea content
  textarea content
`);
	});

	test('<meta>', async () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<meta id="element" name="meta name" content="  meta content  ">
`,
		);

		expect(new HTMLElementUtil(document.querySelector('#element')).getContent()).toBe('  meta content  ');
	});

	test('<pre>', async () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<pre id="element">
  pre content
  pre content
</pre>
`,
		);

		expect(new HTMLElementUtil(document.querySelector('#element')).getContent()).toBe(`  pre content
  pre content
`);
	});
});
