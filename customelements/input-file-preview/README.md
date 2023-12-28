# Show preview with `<input type=file>`

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-input-file-preview.svg)](https://www.npmjs.com/package/@saekitominaga/customelements-input-file-preview)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/input-file-preview-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/input-file-preview-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/customelements/input-file-preview/demo.html)

## Examples

```HTML
<input type="file" is="x-file-preview"
  data-target-for="preview"
  data-error-message='&lt;strong class="error"&gt;&lt;b&gt;${name}&lt;/b&gt; (${size} byte) cannot be previewed.&lt;/strong&gt;'
  data-max-size="1048576"
/>
<p id="preview"></p>
```

## Attributes

<dl>
<dt><code>type</code> [optional]</dt>
<dd>This function automatically sets <code>type="file"</code>.
However, it is recommended to manually add <code>type="file"</code> for JavaScript disabled environments and browsers that do not <a href="https://caniuse.com/custom-elementsv1">support Customized built-in elements</a> (Safari 16, etc.). According to <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">the description in the HTML specification</a>, <q cite="https://html.spec.whatwg.org/multipage/input.html#attr-input-type">The missing value default and invalid value default are the <a href="https://html.spec.whatwg.org/multipage/input.html#text-(type=text)-state-and-search-state-(type=search)">Text</a> state</q>.</dd>
<dt><code>data-target-for</code> [required]</dt>
<dd>ID of the element to display the preview. If the element is <code>&lt;ol&gt;</code>, <code>&lt;ul&gt;</code>, the <code>&lt;li&gt;</code> element will be inserted.</dd>
<dt><code>data-error-message</code> [required]</dt>
<dd>Error message when the file cannot be previewed. You can write HTML markup directly.&nbsp;<code>${name}</code> in the string is converted to the file name, and <code>${size}</code> is converted to the file size (in bytes).</dd>
<dt><code>data-max-size</code> [optional]</dt>
<dd>The number of bytes of maximum file size to preview (Files larger than this will not be previewed, but will not result in an error). If not specified, the default value is 10 MiB.</dd>
</dl>
