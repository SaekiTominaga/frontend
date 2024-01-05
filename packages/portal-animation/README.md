# Add animated motion to the `<portal>` element

[![npm version](https://badge.fury.io/js/%40w0s%2Fportal-animation.svg)](https://www.npmjs.com/package/@w0s/portal-animation)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/portal-animation-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/portal-animation-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/packages/portal-animation/demo.html)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/portal-animation": "..."
    }
  }
</script>
<script type="module">
  import PortalAnimation from '@w0s/portal-animation';

  customElements.define('x-portal-animation', PortalAnimation);
</script>

<x-portal-animation
  src="foo.html"
  referrerpolicy="origin">
</x-portal-animation>
```

## Attributes

<dl>
<dt><code>src</code> [optional]</dt>
<dd>URL of a page to be displayed. (Same as <a href="https://wicg.github.io/portals/#element-attrdef-portal-src"><code>src</code> attribute of <code>&lt;portal&gt;</code> Element</a>)</dd>
<dt><code>referrerpolicy</code> [optional]</dt>
<dd>Referrer Policy. (Same as <a href="https://wicg.github.io/portals/#element-attrdef-portal-referrerpolicy"><code>referrerpolicy</code> attribute of <code>&lt;portal&gt;</code> Element</a>)</dd>
</dl>

e.g. `<x-portal-animation src="https://example.com/" referrerpolicy="same-origin"></x-portal-animation>`

## Style customization (CSS custom properties)

| name | deault | Description |
|-|-|-|
| `--portal-width` | 640px | Width of portal |
| `--portal-height` | 360px | Height of portal |
| `--portal-max-width` | 100% | Maximum width of portal |
| `--portal-max-height` | 100vh | Maximum height of portal |
| `--portal-border-style` | solid | Border style of portal (`border-style` property) |
| `--portal-border-width` | 1px | Border width of portal (`border-width` property) |
| `--portal-border-color` | currentColor | Border color of portal (`border-color` property) |
| `--portal-scale` | 0.5 | Amount of scaling of portal (The value of the `scale()` in the `transform` property) |
| `--portal-animation-duration` | 0.5s | Time a transition animation (`transition-duration` property) |
| `--portal-outline-style` | solid | Outline style of portal (`outline-style` property) |
| `--portal-outline-width` | 1px | Outline width of portal (`outline-width` property) |
| `--portal-outline-color` | currentColor | Outline color of portal (`outline-color` property) |
| `--portal-outline-offset` | 0px | Outline offset of portal (`outline-offset` property) |

- \* Specify a value greater than 0, because setting `--portal-animation-duration` to '0s' disables the detection of 'transitionend' events.

## ⚠ Precautions for use

As of October 2022, there is no officially supported browser for the `<portal>` element ([Can I use...](https://caniuse.com/mdn-html_elements_portal)). Chrome is supported with `chrome://flags/#enable-portals` enabled.
