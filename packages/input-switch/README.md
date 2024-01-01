# `<input type="checkbox" role="switch">` by custom elements

[![npm version](https://badge.fury.io/js/%40w0s%2Finput-switch.svg)](https://www.npmjs.com/package/@w0s/input-switch)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/input-switch-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/input-switch-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/packages/input-switch/demo.html)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/input-switch": "..."
    }
  }
</script>
<script type="module">
  import InputSwitch from '@w0s/input-switch';

  customElements.define('x-input-switch', InputSwitch);
</script>

<label><x-input-switch
  name="foo"
  value="1"
  checked=""
  disabled=""
  storage-key="foo"
></x-input-switch> switch</label>
```

## Attributes

<dl>
<dt><code>name</code> [optional]</dt>
<dd>Name of the element to use for form submission. (Same as <a href="https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-name"><code>name</code> attribute of <code>&lt;input&gt;</code> Element</a>)</dd>
<dt><code>value</code> [optional]</dt>
<dd>Value of the form control. If omitted, the value is "<code>on</code>". (Same as <a href="https://html.spec.whatwg.org/multipage/input.html#attr-input-value"><code>value</code> attribute of <code>&lt;input&gt;</code> Element</a>)</dd>
<dt><code>checked</code> [optional]</dt>
<dd>Whether the control is checked. (Same as <a href="https://html.spec.whatwg.org/multipage/input.html#attr-input-checked"><code>checked</code> attribute of <code>&lt;input&gt;</code> Element</a>)</dd>
<dt><code>disabled</code> [optional]</dt>
<dd>Whether the form control is disabled. (Same as <a href="https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-disabled"><code>disabled</code> attribute of <code>&lt;input&gt;</code> Element</a>)</dd>
<dt><code>storage-key</code> [optional]</dt>
<dd>Save this value as localStorage key when switching controls. (value is `true` or `false` depending on the check state)</dd>
</dl>

## Style customization (CSS custom properties)

| name | deault | Description |
|-|-|-|
| `--switch-width` | 3.6em | Outer frame width |
| `--switch-height` | 1.8em | Outer frame height |
| `--switch-padding` | 0.2em | Spacing between the outer frame and the sphere (Negative value can be specified) |
| `--switch-bgcolor-on` | #2299ff | Background color when \`on\` |
| `--switch-bgcolor-off` | #cccccc | Background color when \`off\` |
| `--switch-bgcolor-disabled-on` | #666666 | [disabled] Background color when \`on\` |
| `--switch-bgcolor-disabled-off` | #666666 | [disabled] Background color when \`off\` |
| `--switch-ball-color` | #ffffff | Slider sphere color (background property) |
| `--switch-animation-duration` | 0.5s | Time a transition animation (transition-duration property) |
| `--switch-outline-mouse-focus` | none | Focus indicator on mouse-focus (outline property) |
