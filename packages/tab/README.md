# Tabs UI component

[![npm version](https://badge.fury.io/js/%40w0s%2Ftab.svg)](https://www.npmjs.com/package/@w0s/tab)
[![test status](https://github.com/SaekiTominaga/frontend/actions/workflows/tab-test.yml/badge.svg)](https://github.com/SaekiTominaga/frontend/actions/workflows/tab-test.yml)

## Demo

- [Demo page](https://saekitominaga.github.io/frontend/packages/tab/demo.html)

## Examples

```HTML
<script type="importmap">
  {
    "imports": {
      "@w0s/tab": "..."
    }
  }
</script>
<script type="module">
  import Tab from '@w0s/tab';

  customElements.define('x-tab', Tab);
</script>

<x-tab
  tablist-label="Tab label"
  storage-key="tab1"
>
  <a href="#tabpanel1" slot="tab">Tab 1</a>
  <a href="#tabpanel2" slot="tab">Tab 2</a>
  <div slot="tabpanel" id="tabpanel1">Tab panel 1</div>
  <div slot="tabpanel" id="tabpanel2">Tab panel 2</div>
</x-tab>
```

## Attributes

<dl>
<dt><code>tablist-label</code> [optional]</dt>
<dd>Label string to set in <code>[role=tablist]</code>. (set as the <code>aria-label</code> attribute value)</dd>
<dt><code>storage-key</code> [optional]</dt>
<dd>When a tab is selected, its value is saved as the <code>sessionStorage</code>. The selected tab is maintained when you navigate or reload the page. <strong>This value should be unique within your site because it is used as the key for <code>sessionStorage</code>.</strong> (Setting this attribute is optional, but it is recommended to set it from the viewpoint of usability.)</dd>
</dl>
