import HTMLElementUtil, {} from './HTMLElementUtil.js';
/**
 * Details content
 */
export default class CustomElementDetailsContent extends HTMLElement {
    #writingMode;
    constructor() {
        super();
        const cssString = `
			:host {
				display: block;
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
        return this.writingMode === 'vertical' ? this.offsetWidth : this.offsetHeight;
    }
    set blockSize(size) {
        this.style.blockSize = size !== null ? `${String(size)}px` : '';
    }
}
//# sourceMappingURL=CustomElementDetailsContent.js.map