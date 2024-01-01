# Get the data of the HTML page of the nearest ancestor hierarchy

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fclosest-html-page.svg)](https://www.npmjs.com/package/@saekitominaga/closest-html-page)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/closest-html-page-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/closest-html-page-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/packages/closest-html-page/demo/)

## Examples

```JavaScript
import ClosestHTMLPage from '@saekitominaga/closest-html-page';

const closestHTMLPage = new ClosestHTMLPage({
  maxFetchCount: 3,
  fetchOptions: {
    redirect: 'error',
  },
  mimeTypes: ['text/html'],
});

await closestHTMLPage.fetch('https://example.com/path/to/file');

const url = closestHTMLPage.getUrl();
const title = closestHTMLPage.getTitle();
```

## Constructor

```TypeScript
new ClosestHTMLPage(options?: Option)
```

### Parameters

<dl>
<dt><code>options</code> [Optional]</dt>
<dd>Options for accessing web content.</dd>
</dl>

### Option

```TypeScript
interface Option {
  maxFetchCount?: number;
  fetchOptions?: RequestInit;
  mimeTypes?: DOMParserSupportedType[];
}
```

<dl>
<dt><code>maxFetchCount</code></dt>
<dd>If no HTML page matching the condition can be retrieved after this number of attempts to access the ancestor hierarchy, the process is rounded up (<code>0</code> = ∞). The default value is <code>0</code>.</dd>
<dt><code>fetchOptions</code></dt>
<dd>An object containing any custom settings that you want to apply to the reques. Same as <a href="https://developer.mozilla.org/en-US/docs/Web/API/fetch#options">the second argument of the `fetch()` method</a>.</dd>
<dt><code>mimeTypes</code></dt>
<dd>MIME types of the HTML resource to retrieve. The values that can be specified are limited to <a href="https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#domparsersupportedtype"><code>DOMParserSupportedType</code> types</a>, namely '<code>text/html</code>', '<code>text/xml</code>', '<code>application/xml</code>', '<code>application/xhtml+xml</code>', and '<code>image/svg+xml</code>'. The default value is <code>['text/html', 'application/xhtml+xml']</code>.</dd>
</dl>

## Methods

<dl>
<dt><code>async fetch(baseUrl: string = location.toString()): Promise&lt;void&gt;</code></dt>
<dd>Traverse the ancestor hierarchy in order from the base URL and retrieve the data of resources that match the specified condition (MIME types). <strong>This method must be called before executing the following <code>getXXX()</code>.</strong></dd>
<dt><code>getFetchedResponses(): Set&lt;Response&gt;</code></dt>
<dd>Get the <code>Response</code> data resulting from the execution of <code>fetch()</code>.</dd>
<dt><code>getUrl(): string | null</code></dt>
<dd>Get the URL of the HTML page of the nearest ancestor hierarchy.</dd>
<dt><code>getTitle(): string | null</code></dt>
<dd>Get the title of the HTML page of the nearest ancestor hierarchy.</dd>
</dl>
