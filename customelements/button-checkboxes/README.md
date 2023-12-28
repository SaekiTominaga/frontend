# Button to check / uncheck checkboxes group

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-button-checkboxes-ctrl.svg)](https://www.npmjs.com/package/@saekitominaga/customelements-button-checkboxes-ctrl)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/button-checkboxes-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/button-checkboxes-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/customelements/button-checkboxes/demo.html)

## Examples

```HTML
<button type="button" is="x-checkboxes-ctrl"
  data-course="check"
  data-target-for="checkboxes1"
>Check all</button>
<span id="checkboxes1">
  <label><input type="checkbox"/> 1</label>
  <label><input type="checkbox"/> 2</label>
  <label><input type="checkbox"/> 3</label>
</span>

<button type="button" is="x-checkboxes-ctrl"
  data-course="check"
  data-targets-class="checkbox2"
>Check all</button>
<span>
  <label><input type="checkbox" class="checkbox2"/> 1</label>
  <label><input type="checkbox" class="checkbox2"/> 2</label>
  <label><input type="checkbox" class="checkbox2"/> 3</label>
</span>

<button type="button" is="x-checkboxes-ctrl"
  data-course="check"
  data-targets-name="checkbox3[]"
>Check all</button>
<span>
  <label><input type="checkbox" name="checkbox3[]"/> 1</label>
  <label><input type="checkbox" name="checkbox3[]"/> 2</label>
  <label><input type="checkbox" name="checkbox3[]"/> 3</label>
</span>
```

## Attributes

<dl>
<dt><code>type</code> [optional]</dt>
<dd>This function automatically sets <code>type="button"</code>.
However, it is recommended to manually add <code>type="button"</code> for JavaScript disabled environments and browsers that do not <a href="https://caniuse.com/custom-elementsv1">support Customized built-in elements</a> (Safari 16, etc.). According to <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">the description in the HTML specification</a>, <q cite="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">The missing value default and invalid value default are the <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type-submit-state">Submit Button</a> state</q>.</dd>
<dt><code>data-course</code> [required]</dt>
<dd>'check' / 'uncheck'</dd>
<dt><code>data-target-for</code> [conditionally required]</dt>
<dd>An ancestor element ID of the checkboxes. (At least one of the <code>data-targets-class</code>, <code>data-targets-name</code>, or this attribute is required)</dd>
<dt><code>data-targets-class</code> [conditionally required]</dt>
<dd>Checkboxes <code>class</code> attribute value. (At least one of the <code>data-target-for</code>, <code>data-targets-name</code>, or this attribute is required)</dd>
<dt><code>data-targets-name</code> [conditionally required]</dt>
<dd>Checkboxes <code>name</code> attribute value. (At least one of the <code>data-target-for</code>, <code>data-targets-class</code>, or this attribute is required)</dd>
</dl>
