import HTMLElementUtil, { type WritingMode } from './HTMLElementUtil.js';

/**
 * Details content
 */
export default class CustomElementDetailsContent extends HTMLElement {
	#writingMode: WritingMode | undefined;

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
		} else {
			/* adoptedStyleSheets 未対応環境 */
			shadow.innerHTML += `<style>${cssString}</style>`;
		}
	}

	connectedCallback(): void {
		this.#writingMode = new HTMLElementUtil(this).getWritingMode();
	}

	get writingMode(): WritingMode | undefined {
		return this.#writingMode;
	}

	get blockSize(): number {
		return this.writingMode === 'vertical' ? this.offsetWidth : this.offsetHeight;
	}

	set blockSize(size: number | null) {
		this.style.blockSize = size !== null ? `${String(size)}px` : '';
	}
}
