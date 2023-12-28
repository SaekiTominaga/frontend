# ISBN input field

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-input-isbn.svg)](https://www.npmjs.com/package/@saekitominaga/customelements-input-isbn)
[![test status](https://github.com/SaekiTominaga/webui/actions/workflows/input-isbn-test.yml/badge.svg)](https://github.com/SaekiTominaga/webui/actions/workflows/input-isbn-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/webui/customelements/input-isbn/demo.html)

## Examples

```HTML
<input is="x-isbn"
  data-validation-message-isbn-checkdigit="ISBN check digit is invalid."
/>
```

## Attributes

<dl>
<dt><code>data-validation-message-isbn-checkdigit</code> [required]</dt>
<dd>Error message when check digit does not match.</dd>
</dl>
