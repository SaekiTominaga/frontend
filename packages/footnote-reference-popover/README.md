# Footnote reference popover

[![npm version](https://badge.fury.io/js/%40w0s%2Ffootnote-reference-popover.svg)](https://www.npmjs.com/package/@w0s/footnote-reference-popover)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/footnote-reference-popover-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/footnote-reference-popover-test.yml)

## Features

- The overall behavior is similar to [Wikipedia footnotes](https://en.wikipedia.org/wiki/Help:Footnotes).
- Automatically copies the HTML of footnotes on the page and displays them as popovers.
  - Markup such as `<a href>` and `<code>` can be used in popovers.
  - However, `id` attributes inside footnote are removed. This is to prevent duplicate IDs from existing in the document.
- A popover is displayed on hovering or clicking the trigger element.
  - The popover is generated the first time a request is made to display the popover, not when the web page loads. This minimizes DOM processing at load time when a large number of popovers are embedded in the page.
- Customizable delay time for showing and hiding for mouse operations.

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/packages/footnote-reference-popover/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/footnote-reference-popover": "..."
    }
  }
</script>
<script type="module">
  import FootnoteReferencePopover from '@w0s/footnote-reference-popover';

  for (const targetElement of document.querySelectorAll('.js-footnote-reference-popover')) {
    new FootnoteReferencePopover(targetElement);
  }
</script>

<a class="js-footnote-reference-popover"
  href="#footnote-1"
>[1]</a>

<a class="js-footnote-reference-popover"
  href="#footnote-2"
  data-popover-label="Note"
  data-popover-class="mypopover"
  data-popover-close-text="Close"
  data-popover-close-image-src="/assets/popover-close.svg"
  data-popover-mouseenter-delay="250"
  data-popover-mouseleave-delay="250"
>[1]</a>

<ul class="footnotes">
<li id="footnote-1">Footnote text. <a href="#">link</a> <code>code</code> <em>emphasis</em></li>
<li id="footnote-2">Footnote text.</li>
</ul>
```

## Attributes

<dl>
<dt><code>href</code> [required]</dt>
<dd>URL hash value of the element that contains the content to be displayed in the popover. (e.g. <code>#footnote-1</code> )</dd>
<dt><code>data-popover-label</code> [optional]</dt>
<dd>Label to be set on popover (<code>aria-label</code> attribute value). It is not required, but should be set as much as possible. In WAI-ARIA 1.2, accessible name is required for <a href="https://www.w3.org/TR/wai-aria-1.2/#dialog"><code>dialog</code> role</a>.</dd>
<dt><code>data-popover-class</code> [optional]</dt>
<dd>Set the class name (<code>class</code> attribute value) on the <code>&lt;dialog&gt;</code> element of the popover. It is mainly used to customize the appearance with CSS.</dd>
<dt><code>data-popover-close-text</code> [optional]</dt>
<dd>The text of the close button in the popover. If omitted, the default value is 'Close'.</dd>
<dt><code>data-popover-close-image-src</code> [optional]</dt>
<dd>The address of the image resource for the close button in the popover. For non Data URLs, the specified path will be inserted in the <code>head</code> element as <code>&lt;link rel="preload" as="image"&gt;</code>.</dd>
<dt><code>data-popover-mouseenter-delay</code> [optional]</dt>
<dd>Delay time between mouse cursor moved within the trigger element and showing the popover (milliseconds). If omitted, the default value is '250'.</dd>
<dt><code>data-popover-mouseleave-delay</code> [optional]</dt>
<dd>Delay time between mouse cursor moved out of the trigger element or popover and closing the popover (milliseconds). If omitted, the default value is '250'.</dd>
</dl>
