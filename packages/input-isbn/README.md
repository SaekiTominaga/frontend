# ISBN input field

[![npm version](https://badge.fury.io/js/%40w0s%2Finput-isbn.svg)](https://www.npmjs.com/package/@w0s/input-isbn)
[![Workflow status](https://github.com/SaekiTominaga/frontend/actions/workflows/input-isbn.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/input-isbn.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/packages/input-isbn/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/input-isbn": "...",
      "@w0s/isbn-verify": "..."
    }
  }
</script>
<script type="module">
  import InputIsbn from '@w0s/input-isbn';

  for (const targetElement of document.querySelectorAll('.js-input-isbn')) {
    new InputIsbn(targetElement);
  }
</script>

<input class="js-input-isbn"
  data-validation-message-isbn-checkdigit="ISBN check digit is invalid."
/>
```

## Attributes

<dl>
<dt><code>data-validation-message-isbn-checkdigit</code> [required]</dt>
<dd>Error message when check digit does not match.</dd>
</dl>
