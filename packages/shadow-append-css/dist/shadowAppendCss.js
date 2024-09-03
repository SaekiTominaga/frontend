/**
 * Appending CSS into the shadow DOM
 *
 * @param shadow - The root node of a DOM subtree
 * @param cssString - A string of the CSS
 */
export default (shadow, cssString) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (shadow.adoptedStyleSheets !== undefined) {
        const css = new CSSStyleSheet();
        css.replaceSync(cssString);
        shadow.adoptedStyleSheets.push(css);
    }
    else {
        /* `adoptedStyleSheets` 未対応環境 */
        const style = document.createElement('style');
        style.textContent = cssString;
        shadow.appendChild(style);
    }
};
//# sourceMappingURL=shadowAppendCss.js.map