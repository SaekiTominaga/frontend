# Appending CSS into the shadow DOM

[![npm version](https://badge.fury.io/js/%40w0s%2Fshadow-append-css.svg)](https://www.npmjs.com/package/@w0s/shadow-append-css)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/shadow-append-css-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/shadow-append-css-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/packages/shadow-append-css/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/shadow-append-css": "..."
    }
  }
</script>
<script type="module">
  import shadowAppendCss from '@w0s/shadow-append-css';

  class MyElement extends HTMLElement {
    constructor() {
      super();

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = '<slot></slot>';

      const cssString = `
        :host {
          display: block flow;
          align-content: center;
          background: #f00;
          block-size: 10em;
          inline-size: 10em;
          text-align: center;
          color: #000;
        }
      `;

      shadowAppendCss(shadow, cssString);
    }
  }

  customElements.define('my-element', MyElement);
</script>

<my-element>
  <p>text</p>
</my-element>
```
