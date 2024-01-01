# Automatically adjust the block size dimension of the `<textarea>` element to the input content

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-textarea-autoheight.svg)](https://www.npmjs.com/package/@saekitominaga/customelements-textarea-autoheight)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/textarea-auto-size-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/textarea-auto-size-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/javascript/textarea-auto-size/demo.html)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/textarea-auto-size": "..."
    }
  }
</script>
<script type="module">
  import TextareaAutoSize from '@w0s/textarea-auto-size';

  for (const targetElement of document.querySelectorAll('.js-textarea-auto-size')) {
    new TextareaAutoSize(targetElement);
  }
</script>

<textarea class="js-textarea-auto-size"></textarea>
```
