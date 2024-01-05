# Input validation of form control

[![npm version](https://badge.fury.io/js/%40w0s%2Fform-control-validation.svg)](https://www.npmjs.com/package/@w0s/form-control-validation)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/form-control-validation-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/form-control-validation-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/packages/form-control-validation/demo/)

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
  import FormControlValidation from '@w0s/form-control-validation';

  for (const formControlElement of document.querySelectorAll('.js-form-control-validation')) {
    new FormControlValidation(formControlElement);
  }
</script>

<!-- input -->
<p><input class="js-form-control-validation" pattern="[a-zA-Z0-9]+"
  aria-errormessage="validation-input"
  data-validation-message-pattern="Only alphanumeric characters can be used."
/></p>
<p hidden="" id="validation-input"></p>

<!-- radio buttons -->
<p role="radiogroup" class="js-form-control-validation" aria-errormessage="validation-radio">
<label><input type="radio" required="" />Radio 1</label>
<label><input type="radio" required="" />Radio 2</label>
</p>
<p hidden="" id="validation-radio"></p>

<!-- select -->
<p><select class="js-form-control-validation" required="" aria-errormessage="validation-select">
<option label="Please select"></option>
<option value="1">Select 1</option>
<option value="2">Select 2</option>
</select></p>
<p hidden="" id="validation-select"></p>

<!-- textarea -->
<p><textarea class="js-form-control-validation"
  aria-errormessage="validation-textarea"></textarea></p>
<p hidden="" id="validation-textarea"></p>
```

## Constructor

```TypeScript
new FormControlValidation(
  thisElement: HTMLElement
)
```

### Parameters

<dl>
<dt><code>thisElement</code> [required]</dt>
<dd>Target element</dd>
</dl>

## HTMLElement Attributes

<dl>
<dt><code>aria-errormessage</code> [required]</dt>
<dd>ID of the element that displays the validation message. See <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage">WAI-ARIA 1.2</a> for details.</dd>
<dt><code>data-validation-message-pattern</code> [optional]</dt>
<dd>Error message when it does not match the <code>pattern</code> attribute value. If omitted, the default message of the browser is displayed.</dd>
</dl>
