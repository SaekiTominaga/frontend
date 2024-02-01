# Implement something like `<input type=checkbox switch>`

[![npm version](https://badge.fury.io/js/%40w0s%2Finput-switch.svg)](https://www.npmjs.com/package/@w0s/input-switch)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/input-switch-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/input-switch-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/packages/input-switch/demo/)

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
<dd>Value of the form control. If omitted, the value is <code>on</code>. (Same as <a href="https://html.spec.whatwg.org/multipage/input.html#attr-input-value"><code>value</code> attribute of <code>&lt;input&gt;</code> Element</a>)</dd>
<dt><code>checked</code> [optional]</dt>
<dd>Whether the control is checked. (Same as <a href="https://html.spec.whatwg.org/multipage/input.html#attr-input-checked"><code>checked</code> attribute of <code>&lt;input&gt;</code> Element</a>)</dd>
<dt><code>disabled</code> [optional]</dt>
<dd>Whether the form control is disabled. (Same as <a href="https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-disabled"><code>disabled</code> attribute of <code>&lt;input&gt;</code> Element</a>)</dd>
<dt><code>storage-key</code> [optional]</dt>
<dd>Save this value as <code>localStorage</code> key when switching controls. (value is <code>true</code> or <code>false</code> depending on the check state)</dd>
</dl>

## Style customization

The switch markup looks like this.

```html
<x-input-switch class="my-switch">
  #shadow-root (open)
    <div part="track"></div>
    <div part="thumb"></div>
</x-input-switch>
```

Therefore, you can customize the style using [`::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) CSS pseudo-element.

```css
.my-switch {
  ...

  &::part(track) {
    ...
  }

  &::part(thumb) {
    ...
  }
}
```

The following CSS custom properties can be used to customize the style.

### host

| name | deault | Description |
|-|-|-|
| `--inline-size` | `2em` | Outer frame inline size |
| `--block-size` | `1em` | Outer frame block size |
| `--animation-duration` | `0.5s` | Time a transition animation (`transition-duration` property) |

### `::part(track)`

| name | deault | Description |
|-|-|-|
| `--color-on` | `#2299ff` | Track color when switch is on |
| `--color-off` | `#cccccc` | Track color when switch is off |
| `--color-disabled-on` | `#666666` | Track color when switch is on `disabled` |
| `--color-disabled-off` | `#666666` | Track color when switch is off and `disabled` |

### `::part(thumb)`

| name | deault | Description |
|-|-|-|
| `--color` | `#ffffff` | Color of slider ball |
| `--radius` | `calc(0.5em - 1px)` | Radius of slider ball |

### Important point

Other arbitrary styles (`margin`, `box-shadow`, etc.) can also be set, but may be changed outside of major version upgrades.

Please see the [demo page](https://saekitominaga.github.io/frontend/packages/input-switch/demo/) for specific usage.
