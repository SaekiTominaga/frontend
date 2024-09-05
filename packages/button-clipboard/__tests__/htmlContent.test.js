import { beforeEach, test, expect } from '@jest/globals';
import htmlContent from '../dist/htmlContent.js';

beforeEach(() => {
	document.body.innerHTML = '';
});

test('<img>', async () => {
	document.body.insertAdjacentHTML('beforeend', '<img src="xxx" alt="  content  ">');

	expect(htmlContent(document.querySelector('img'))).toBe(`  content  `);
});

test('<textarea>', async () => {
	document.body.insertAdjacentHTML(
		'beforeend',
		`
<textarea>
  content
  content
</textarea>
`,
	);

	expect(htmlContent(document.querySelector('textarea'))).toBe(`  content
  content
`);
});

test('<meta>', async () => {
	document.body.insertAdjacentHTML('beforeend', '<meta name="meta name" content="  content  ">');

	expect(htmlContent(document.querySelector('meta'))).toBe('  content  ');
});

test('<meter>', async () => {
	document.body.insertAdjacentHTML('beforeend', '<meter value="0.1">');

	expect(htmlContent(document.querySelector('meter'))).toBe('0.1');
});

test('<pre>', async () => {
	document.body.insertAdjacentHTML(
		'beforeend',
		`
<pre>
  content
  content
</pre>
`,
	);

	expect(htmlContent(document.querySelector('pre'))).toBe(`  content
  content
`);
});

test('<p>', async () => {
	document.body.insertAdjacentHTML(
		'beforeend',
		`
<p>
  content
  content
</p>
`,
	);

	expect(htmlContent(document.querySelector('p'))).toBe(`content
  content`);
});
