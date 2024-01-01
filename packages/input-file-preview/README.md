# Show preview with `<input type=file>`

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-input-file-preview.svg)](https://www.npmjs.com/package/@saekitominaga/customelements-input-file-preview)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/input-file-preview-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/input-file-preview-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/packages/input-file-preview/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/input-file-preview": "...",
      "@w0s/html-escape": "...",
      "whatwg-mimetype": "..."
    }
  }
</script>
<script type="module">
  import InputFilePreview from '@w0s/input-file-preview';

  for (const targetElement of document.querySelectorAll('.js-input-file-preview')) {
    new InputFilePreview(targetElement);
  }
</script>

<input type="file" class="js-input-file-preview"
  data-preview="preview"
  data-error-message='&lt;strong class="error"&gt;&lt;b&gt;${name}&lt;/b&gt; (${size} byte) cannot be previewed.&lt;/strong&gt;'
  data-max-size="1048576"
/>
<p id="preview"></p>
```

## Attributes

<dl>
<dt><code>type</code> [required]</dt>
<dd>This attribute must include <code>file</code>.</dd>
<dt><code>data-preview</code> [required]</dt>
<dd>ID of the element to display the preview. If the element is <code>&lt;ol&gt;</code>, <code>&lt;ul&gt;</code>, the <code>&lt;li&gt;</code> element will be inserted.</dd>
<dt><code>data-error-message</code> [required]</dt>
<dd>Error message when the file cannot be previewed. You can write HTML markup directly. <code>${name}</code> in the string is converted to the file name, and <code>${size}</code> is converted to the file size (in bytes).</dd>
<dt><code>data-max-size</code> [optional]</dt>
<dd>The number of bytes of maximum file size to preview (Files larger than this will not be previewed, but will not result in an error). If not specified, the default value is 10 MiB.</dd>
</dl>
