# Display a `confirm()` modal dialog when button is pressed

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-button-confirm.svg)](https://www.npmjs.com/package/@saekitominaga/customelements-button-confirm)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/button-confirm-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/button-confirm-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/customelements/button-confirm/demo.html)

## Examples

```HTML
<button is="x-confirm"
  data-message="Message text"
>Submit</button>
```

## Attributes

<dl>
<dt><code>data-message</code> [required]</dt>
<dd>A string you want to display in the <code>confirm()</code> modal dialog.</dd>
</dl>
