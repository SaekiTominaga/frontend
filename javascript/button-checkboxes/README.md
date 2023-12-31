# Button to check / uncheck checkboxes group

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-button-checkboxes-ctrl.svg)](https://www.npmjs.com/package/@saekitominaga/customelements-button-checkboxes-ctrl)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/button-checkboxes-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/button-checkboxes-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/javascript/button-checkboxes/demo.html)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/button-checkboxes-ctrl": "...",
      "uuid": "..."
    }
  }
</script>
<script type="module">
import ButtonCheckboxes from '@w0s/button-checkboxes-ctrl';

for (const targetElement of document.querySelectorAll('.js-checkboxes-ctrl')) {
  new ButtonCheckboxes(targetElement);
}
</script>

<button type="button" class="js-checkboxes-ctrl"
  data-course="check"
  data-control="checkbox-group"
>Check all</button>
<p id="checkbox-group">
  <label><input type="checkbox"/> 1</label>
  <label><input type="checkbox"/> 2</label>
  <label><input type="checkbox"/> 3</label>
</p>

<button type="button" class="js-checkboxes-ctrl"
  data-course="check"
  data-controls-class="checkbox"
>Check all</button>
<p>
  <label><input type="checkbox" class="checkbox"/> 1</label>
  <label><input type="checkbox" class="checkbox"/> 2</label>
  <label><input type="checkbox" class="checkbox"/> 3</label>
</p>

<button type="button" class="js-checkboxes-ctrl"
  data-course="check"
  data-controls-name="checkbox[]"
>Check all</button>
<p>
  <label><input type="checkbox" name="checkbox[]"/> 1</label>
  <label><input type="checkbox" name="checkbox[]"/> 2</label>
  <label><input type="checkbox" name="checkbox[]"/> 3</label>
</p>
```

## Attributes

<dl>
<dt><code>type</code> [optional]</dt>
<dd>This attribute is not required, but it is recommended to include <code>type="button"</code>. According to <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">the description in the HTML specification</a>, <q cite="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">The missing value default and invalid value default are the <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type-submit-state">Submit Button</a> state</q>.</dd>
<dt><code>data-course</code> [required]</dt>
<dd><code>check</code> / <code>uncheck</code></dd>
<dt><code>data-control</code> [conditionally required]</dt>
<dd>An ancestor element ID of the checkboxes. (At least one of the <code>data-controls-class</code>, <code>data-controls-name</code>, or this attribute is required)</dd>
<dt><code>data-controls-class</code> [conditionally required]</dt>
<dd>Checkboxes <code>class</code> attribute value. (At least one of the <code>data-control</code>, <code>data-controls-name</code>, or this attribute is required)</dd>
<dt><code>data-controls-name</code> [conditionally required]</dt>
<dd>Checkboxes <code>name</code> attribute value. (At least one of the <code>data-control</code>, <code>data-controls-class</code>, or this attribute is required)</dd>
</dl>