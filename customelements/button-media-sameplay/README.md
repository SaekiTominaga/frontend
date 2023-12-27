# Simultaneous playback button for multiple audio / video

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-button-media-sameplay.svg)](https://www.npmjs.com/package/@saekitominaga/customelements-button-media-sameplay)
[![test status](https://github.com/SaekiTominaga/webui/actions/workflows/button-media-sameplay-test.yml/badge.svg)](https://github.com/SaekiTominaga/webui/actions/workflows/button-media-sameplay-test.yml)

- If you press the button during pause, the playback starts from the position with the lowest playback time.
- Pause if you press a button during playback.
- If all the target media elements has finished playing, start playing from the beginning.

## Demo

- [Demo page](https://saekitominaga.github.io/webui/customelements/button-media-sameplay/demo.html)

## Examples

```HTML
<button type="button" is="x-media-same-play"
  data-targets-for="video1 video2"
>Simultaneous playback</button>

<video src="video.webm" controls="" id="video1"></video>
<video src="video.webm" controls="" id="video2"></video>
```

## Attributes

<dl>
<dt><code>type</code> [optional]</dt>
<dd>This function automatically sets <code>type="button"</code>.
However, it is recommended to manually add <code>type="button"</code> for JavaScript disabled environments and browsers that do not <a href="https://caniuse.com/custom-elementsv1">support Customized built-in elements</a> (Safari 14, Edge Legacy, etc.). According to <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">the description in the HTML specification</a>, <q cite="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type">The missing value default and invalid value default are the <a href="https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type-submit-state">Submit Button</a> state</q>.</dd>
<dt><code>data-targets-for</code> [required]</dt>
<dd>Multiple media element's ID. (Space delimited)</dd>
</dl>
