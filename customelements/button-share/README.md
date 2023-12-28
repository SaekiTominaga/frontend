# Share button

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-button-share.svg)](https://www.npmjs.com/package/@saekitominaga/customelements-button-share)
[![test status](https://github.com/SaekiTominaga/webui/actions/workflows/button-share-test.yml/badge.svg)](https://github.com/SaekiTominaga/webui/actions/workflows/button-share-test.yml)

Share button using [Web Share API](https://www.w3.org/TR/web-share/).

## Demo

- [Demo page](https://saekitominaga.github.io/webui/customelements/button-share/demo.html)

## Examples

```HTML
<button type="button" is="x-share"
  data-share-text="Message text"
  data-share-title="Page title"
  data-share-url="/path/to"
>Share</button>
```

## Attributes

<dl>
<dt><code>type</code> [optional]</dt>
<dd>This function automatically sets <code>type="button"</code>.
However, it is recommended to manually add <code>type="button"</code> for JavaScript disabled environments and browsers that do not <a href="https://caniuse.com/custom-elementsv1">support Customized built-in elements</a> (Safari 16, etc.). According to <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">the description in the HTML specification</a>, <q cite="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">The missing value default and invalid value default are the <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type-submit-state">Submit Button</a> state</q>.</dd>
<dt><code>data-share-text</code> [optional]</dt>
<dd>Arbitrary text that forms the body of the message being shared. If omitted, it will be an empty string.</dd>
<dt><code>data-share-title</code> [optional]</dt>
<dd>The title of the document being shared. May be ignored by the target. If omitted, the value of <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/title">document.title</a> will be set.</dd>
<dt><code>data-share-url</code> [optional]</dt>
<dd>A URL string referring to a resource being shared. The url can contain a relative-URL string. If omitted, the value of <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/URL">document.URL</a> will be set.</dd>
</dl>
