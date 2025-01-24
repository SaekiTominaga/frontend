# Prevent page unloaded while filling out a form

[![npm version](https://badge.fury.io/js/%40w0s%2Fform-before-unload-confirm.svg)](https://www.npmjs.com/package/@w0s/form-before-unload-confirm)
[![Workflow status](https://github.com/SaekiTominaga/frontend/actions/workflows/form-before-unload-confirm.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/form-before-unload-confirm.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/packages/form-before-unload-confirm/demo/)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/form-before-unload-confirm": "..."
    }
  }
</script>
<script type="module">
  import formBeforeUnloadConfirm from '@w0s/form-before-unload-confirm';

  formBeforeUnloadConfirm(document.querySelectorAll('.js-form-beforeunload-confirm')); // `getElementById()` or `getElementsByClassName()` or `getElementsByTagName()` or `querySelector()` or `querySelectorAll()`
</script>

<form class="js-form-beforeunload-confirm">
  <p><input /></p>
  <p><button>Submit</button></p>
</form>
```
