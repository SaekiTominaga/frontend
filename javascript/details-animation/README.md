# Animating the `<details>` element

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-details-animation.svg)](https://www.npmjs.com/package/@saekitominaga/customelements-details-animation)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/details-animation-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/details-animation-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/javascript/details-animation/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/details-animation": "..."
    }
  }
</script>
<script type="module">
  import DetailsAnimation from '@w0s/details-animation';

  for (const targetElement of document.querySelectorAll('.js-details-animation')) {
    new DetailsAnimation(targetElement);
  }
</script>

<details class="js-details-animation"
  open=""
  data-duration="1000"
  data-easing="linear"
>
  <summary>Caption Text</summary>
  <p>Contents text</p>
</details>
```

## Attributes

<dl>
<dt><code>open</code> [optional]</dt>
<dd>Whether the details are visible. (<a href="https://html.spec.whatwg.org/multipage/interactive-elements.html#attr-details-open">open attribute of <code>&lt;details&gt;</code> Element</a>)</dd>
<dt><code>data-duration</code> [optional]</dt>
<dd>The iteration duration which is a real number greater than or equal to zero (including positive infinity) representing the time taken to complete a single iteration of the animation effect (See <a href="https://www.w3.org/TR/web-animations-1/#dictdef-optionaleffecttiming"><code>OptionalEffectTiming</code></a> for details). If omitted, the default value is <code>500</code>(ms).</dd>
<dt><code>data-easing</code> [optional]</dt>
<dd>The timing function used to scale the time to produce easing effects (See <a href="https://www.w3.org/TR/web-animations-1/#dictdef-optionaleffecttiming"><code>OptionalEffectTiming</code></a> for details). If omitted, the default value is <code>ease</code>.</dd>
</dl>

## Sample CSS

In order to achieve animation, the timing of setting the `open` attribute of the `<details>` element is delayed. Therefore, the viewlet icon of the `<summary>` element should be determined by the `data-pre-open` attribute.

```CSS
details[data-pre-open] > summary {
  list-style: none;
}

details[data-pre-open] > summary::-webkit-details-marker {
  display: none;
} /* Safari(17) doesn't support `list-style`, so you need to use the `::-webkit-details-marker` pseudo-element <https://caniuse.com/mdn-html_elements_summary_display_list_item> */

details[data-pre-open] > summary::before {
  margin-inline-end: 0.5em;
  display: inline-block;
  content: '▼';
}

details[data-pre-open='false'] > summary::before {
  transform: rotate(-90deg);
}
```

\* Don't forget to add `details[data-pre-open]` to all selectors. This will avoid styling in environments where JavaScript is disabled.
