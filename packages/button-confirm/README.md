# Display a `confirm()` modal dialog when button is pressed

[![npm version](https://badge.fury.io/js/%40w0s%2Fbutton-confirm.svg)](https://www.npmjs.com/package/@w0s/button-confirm)
[![Workflow status](https://github.com/SaekiTominaga/frontend/actions/workflows/button-confirm.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/button-confirm.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/packages/button-confirm/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/button-confirm": "..."
    }
  }
</script>
<script type="module">
  import ButtonConfirm from '@w0s/button-confirm';

  for (const targetElement of document.querySelectorAll('.js-button-confirm')) {
    new ButtonConfirm(targetElement);
  }
</script>

<form>
  <p>
    <button class="js-button-confirm"
      data-message="Message text"
    >Submit</button>
  </p>
</form>
```

## Attributes

<dl>
<dt><code>data-message</code> [required]</dt>
<dd>A string you want to display in the <code>confirm()</code> modal dialog.</dd>
</dl>
