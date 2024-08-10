import HTMLElementUtil, {} from './HTMLElementUtil.js';
/**
 * The additional information in a `<details>` element
 *
 * This is the same as `::details-content` pseudo-element <https://drafts.csswg.org/css-pseudo-4/#details-content-pseudo>
 */
export default class CustomElementDetailsContent extends HTMLElement {
    #writingMode;
    constructor() {
        super();
        const cssString = `
			:host {
				display: block flow;
				overflow: hidden;
			}
		`;
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
			<slot></slot>
		`;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (shadow.adoptedStyleSheets !== undefined) {
            const cssStyleSheet = new CSSStyleSheet();
            cssStyleSheet.replaceSync(cssString);
            shadow.adoptedStyleSheets = [cssStyleSheet];
        }
        else {
            /* adoptedStyleSheets 未対応環境 */
            shadow.innerHTML += `<style>${cssString}</style>`;
        }
    }
    connectedCallback() {
        this.#writingMode = new HTMLElementUtil(this).getWritingMode();
    }
    get writingMode() {
        return this.#writingMode;
    }
    get blockSize() {
        return this.writingMode === 'vertical' ? this.clientWidth : this.clientHeight;
    }
    get scrollBlockSize() {
        return this.writingMode === 'vertical' ? this.scrollWidth : this.scrollHeight;
    }
    /**
     * Clear styles set by `Animation.commitStyles()`.
     */
    clearStyles() {
        this.removeAttribute('style');
    }
}
//# sourceMappingURL=CustomElementDetailsContent.js.map