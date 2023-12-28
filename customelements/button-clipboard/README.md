# Clipboard write text button

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-button-clipboard.svg)](https://www.npmjs.com/package/@saekitominaga/customelements-button-clipboard)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/button-clipboard-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/button-clipboard-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/customelements/button-clipboard/demo.html)

## Examples

```HTML
<button type="button" is="x-clipboard"
  data-text="Text"
>Copy</button>

<p id="clipboard-target">Text</p><!-- Target element: If the `data-target-for` attribute exists, write the contents of this element (Node.textContent or HTMLXXXElement.value or HTMLMetaElement.content) to the clipboard. -->
<button type="button" is="x-clipboard"
  data-target-for="clipboard-target"
  data-feedback-for="clipboard-feedback"
>Copy</button>
<p id="clipboard-feedback" hidden=""></p><!-- Feedback element: It will be displayed when writing to the clipboard is done. -->
```

## Attributes

<dl>
<dt><code>type</code> [optional]</dt>
<dd>This function automatically sets <code>type="button"</code>.
However, it is recommended to manually add <code>type="button"</code> for JavaScript disabled environments and browsers that do not <a href="https://caniuse.com/custom-elementsv1">support Customized built-in elements</a> (Safari 14, Edge Legacy, etc.). According to <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">the description in the HTML specification</a>, <q cite="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">The missing value default and invalid value default are the <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type-submit-state">Submit Button</a> state</q>.</dd>
<dt><code>data-text</code> [conditionally required]</dt>
<dd>Text to write to clipboard. (Either the <code>data-target-for</code> attribute or this attribute is required)</dd>
<dt><code>data-target-for</code> [conditionally required]</dt>
<dd>Target element's ID. (Either the <code>data-text</code> attribute or this attribute is required)</dd>
<dt><code>data-feedback-for</code> [optional]</dt>
<dd>Feedback element's ID displayed when writing to the clipboard is done. (If omitted, feedback will be displayed in <code>console</code>)</dd>
</dl>
