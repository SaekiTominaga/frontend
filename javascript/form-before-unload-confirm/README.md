# Prevent page unloaded while filling out a form

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fhtmlformelement-before-unload-confirm.svg)](https://www.npmjs.com/package/@saekitominaga/htmlformelement-before-unload-confirm)
[![test status](https://github.com/SaekiTominaga/webui/actions/workflows/form-before-unload-confirm-test.yml/badge.svg)](https://github.com/SaekiTominaga/webui/actions/workflows/form-before-unload-confirm.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/webui/javascript/form-before-unload-confirm/demo.html)

## Examples

```HTML
<script type="module">
import FormBeforeUnloadConfirm from './dist/FormBeforeUnloadConfirm.js';

for (const formElement of document.querySelectorAll('.js-form-beforeunload-confirm')) {
  const formBeforeUnloadConfirm = new FormBeforeUnloadConfirm(formElement);
  formBeforeUnloadConfirm.init();
}
</script>

<form class="js-form-beforeunload-confirm">
  <p><input /></p>
  <p><button>Submit</button></p>
</form>
```

## Constructor

```TypeScript
new FormBeforeUnloadConfirm(
  thisElement: HTMLFormElement
)
```

### Parameters

<dl>
<dt><code>thisElement</code> [required]</dt>
<dd>Target element</dd>
</dl>