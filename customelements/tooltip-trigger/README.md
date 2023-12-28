# Tooltip UI

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-tooltip-trigger.svg)](https://www.npmjs.com/package/@saekitominaga/customelements-tooltip-trigger)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/tooltip-trigger-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/tooltip-trigger-test.yml)

## Features

- The overall behavior is similar to [Wikipedia footnotes](https://en.wikipedia.org/wiki/Help:Footnotes).
- Automatically copies the HTML of footnotes on the page and displays them as tooltips.
  - Markup such as `<a href>` and `<code>` can be used in tooltips.
  - However, `id` attributes inside footnote are removed. This is to prevent duplicate IDs from existing in the document.
- A tooltip is displayed on hovering or clicking the trigger element.
  - The tooltip is generated the first time a request is made to display the tooltip, not when the web page loads. This minimizes DOM processing at load time when a large number of tooltips are embedded in the page.
- Customizable delay time for showing and hiding for mouse operations.
- The `<dialog>` element is used to represent the tooltip. (Firefox 98+, Safari 15.4+, Chrome 37+)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/customelements/tooltip-trigger/demo.html)

## Examples

```HTML
<!-- ↓ The following element are automatically inserted from JavaScript in `<head>` when the page loads -->
<link rel="preload" as="image" href="/assets/tooltip-close.svg">

<a is="x-tooltip-trigger"
  href="#footnote-1"
>[1]</a>

<a is="x-tooltip-trigger"
  href="#footnote-2"
  data-tooltip-label="Note"
  data-tooltip-class="mytooltip"
  data-tooltip-close-text="Close"
  data-tooltip-close-image-src="/assets/tooltip-close.svg"
  data-tooltip-mouseenter-delay="250"
  data-tooltip-mouseleave-delay="250"
>[1]</a>

<ul class="footnotes">
<li id="footnote-1">Footnote text. <a href="#">link</a> <code>code</code> <em>emphasis</em></li>
<li id="footnote-2">Footnote text.</li>
</ul>

<!-- ↓ The following element are automatically inserted from JavaScript just before `</body>` when the first request to display the tooltip is made -->
<x-tooltip>...</x-tooltip>
```

## Attributes

<dl>
<dt><code>href</code> [required]</dt>
<dd>URL hash value of the element that contains the content to be displayed in the tooltip. (e.g. <code>#footnote-1</code> )</dd>
<dt><code>data-tooltip-label</code> [optional]</dt>
<dd>Label to be set on tooltip (<code>aria-label</code> attribute value). It is not required, but should be set as much as possible. In WAI-ARIA 1.2, accessible name is required for <a href="https://www.w3.org/TR/wai-aria-1.2/#dialog"><code>dialog</code> role</a>.</dd>
<dt><code>data-tooltip-class</code> [optional]</dt>
<dd>Set the class name (<code>class</code> attribute value) on the <code>&lt;dialog&gt;</code> element of the tooltip. It is mainly used to customize the appearance with CSS.</dd>
<dt><code>data-tooltip-close-text</code> [optional]</dt>
<dd>The text of the close button in the tooltip. If omitted, the default value is 'Close'.</dd>
<dt><code>data-tooltip-close-image-src</code> [optional]</dt>
<dd>The address of the image resource for the close button in the tooltip. For non Data URLs, the specified path will be inserted in the <code>head</code> element as <code>&lt;link rel="preload" as="image"&gt;</code>.</dd>
<dt><code>data-tooltip-mouseenter-delay</code> [optional]</dt>
<dd>Delay time between mouse cursor moved within the trigger element and showing the tooltip (milliseconds). If omitted, the default value is '250'.</dd>
<dt><code>data-tooltip-mouseleave-delay</code> [optional]</dt>
<dd>Delay time between mouse cursor moved out of the trigger element or tooltip and closing the tooltip (milliseconds). If omitted, the default value is '250'.</dd>
</dl>

## Overview of update from version 1 to version 2

**There are major incompatible changes in version 2.**

- [@saekitominaga/customelements-tooltip](https://www.npmjs.com/package/@saekitominaga/customelements-tooltip) installation is no longer required.
- Some `data-*` attribute names have been changed.
- Customizing the appearance of tooltips requires writing your own CSS.
