# Clipboard write text button

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-button-clipboard.svg)](https://www.npmjs.com/package/@saekitominaga/customelements-button-clipboard)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/button-clipboard-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/button-clipboard-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/javascript/button-clipboard/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/button-clipboard": "..."
    }
  }
</script>
<script type="module">
  import ButtonClipboard from '@w0s/button-clipboard';

  for (const targetElement of document.querySelectorAll('.js-clipboard')) {
    new ButtonClipboard(targetElement);
  }
</script>

<button type="button" class="js-clipboard"
  data-text="Text"
>Copy</button>

<p id="clipboard-target">Text</p><!-- Target element: If the `data-target` attribute exists, write the contents of this element (`Node.textContent` or `HTMLXXXElement.value` or `HTMLMetaElement.content`) to the clipboard -->
<button type="button" class="js-clipboard"
  data-target="clipboard-target"
  data-feedback="clipboard-feedback"
>Copy</button>
<p id="clipboard-feedback" hidden="">✔ Clipboard write successful!</p><!-- Feedback element: It will be displayed when writing to the clipboard is done -->
```

## Attributes

<dl>
<dt><code>type</code> [optional]</dt>
<dd>This attribute is not required, but it is recommended to include <code>type="button"</code>. According to <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">the description in the HTML specification</a>, <q cite="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">The missing value default and invalid value default are the <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type-submit-state">Submit Button</a> state</q>.</dd>
<dt><code>data-text</code> [conditionally required]</dt>
<dd>Text to write to clipboard. (Either the <code>data-target</code> attribute or this attribute is required)</dd>
<dt><code>data-target</code> [conditionally required]</dt>
<dd>Target element ID. (Either the <code>data-text</code> attribute or this attribute is required)</dd>
<dt><code>data-feedback</code> [optional]</dt>
<dd>Feedback element ID displayed when writing to the clipboard is done. (If omitted, feedback will be displayed in <code>console</code>)</dd>
</dl>
