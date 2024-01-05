# Cover the entire screen with an overlay when form submitting

[![npm version](https://badge.fury.io/js/%40w0s%2Fform-submit-overlay.svg)](https://www.npmjs.com/package/@w0s/form-submit-overlay)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/form-submit-overlay-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/form-submit-overlay-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/packages/form-submit-overlay/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/form-submit-overlay": "..."
    }
  }
</script>
<script type="module">
  import FormSubmitOverlay from '@w0s/form-submit-overlay';

  for (const formElement of document.querySelectorAll('.js-form-submit-overlay')) {
    new FormSubmitOverlay(formElement);
  }
</script>

<form class="js-form-submit-overlay"
  data-overlayed-by="form-submit-overlay"
>
</form>

<dialog id="form-submit-overlay" aria-labelledby="form-submit-overlay-message" aria-describedby="form-submit-overlay-message">
  <p id="form-submit-overlay-message">Loading...</p>
</dialog>
```

## Constructor

```TypeScript
new FormSubmitOverlay(
  thisElement: HTMLFormElement
)
```

### Parameters

<dl>
<dt><code>thisElement</code> [required]</dt>
<dd>Target <code>form</code> element</dd>
</dl>

## HTMLElement Attributes

<dl>
<dt><code>data-overlayed-by</code> [required]</dt>
<dd>ID of the overlay (<code>&lt;dialog&gt;</code> element) to be displayed when form submitting</dd>
</dl>
