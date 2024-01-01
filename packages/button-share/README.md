# Share button

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-button-share.svg)](https://www.npmjs.com/package/@saekitominaga/customelements-button-share)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/button-share-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/button-share-test.yml)

Share button using [Web Share API](https://www.w3.org/TR/web-share/).

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/packages/button-share/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/button-share": "..."
    }
  }
</script>
<script type="module">
  import ButtonShare from '@w0s/button-share';

  for (const targetElement of document.querySelectorAll('.js-button-share')) {
    new ButtonShare(targetElement);
  }
</script>

<button type="button" class="js-button-share"
  data-text="Message text"
  data-title="Page title"
  data-url="/path/to"
>Share</button>
```

## Attributes

<dl>
<dt><code>type</code> [optional]</dt>
<dd>This attribute is not required, but it is recommended to include <code>type="button"</code>. According to <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">the description in the HTML specification</a>, <q cite="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">The missing value default and invalid value default are the <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type-submit-state">Submit Button</a> state</q>.</dd>
<dt><code>data-text</code> [optional]</dt>
<dd>Arbitrary text that forms the body of the message being shared. If omitted, it will be an empty string.</dd>
<dt><code>data-title</code> [optional]</dt>
<dd>The title of the document being shared. May be ignored by the target. If omitted, the value of <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/title">document.title</a> will be set.</dd>
<dt><code>data-url</code> [optional]</dt>
<dd>A URL string referring to a resource being shared. The url can contain a relative-URL string. If omitted, the value of <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/URL">document.URL</a> will be set.</dd>
</dl>
