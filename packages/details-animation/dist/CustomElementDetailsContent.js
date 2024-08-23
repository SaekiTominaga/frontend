import HTMLElementUtil, {} from './HTMLElementUtil.js';
/**
 * The additional information in a `<details>` element
 *
 * This is the same as `::details-content` pseudo-element <https://drafts.csswg.org/css-pseudo-4/#details-content-pseudo>
 */
export default class CustomElementDetailsContent extends HTMLElement {
    #writingMode;
    #animation = null;
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
        this.#writingMode = new HTMLElementUtil(this).writingMode;
    }
    get blockSize() {
        return this.#writingMode === 'vertical' ? this.clientWidth : this.clientHeight;
    }
    get scrollBlockSize() {
        return this.#writingMode === 'vertical' ? this.scrollWidth : this.scrollHeight;
    }
    /**
     * Open contents area
     *
     * @param animationOptions - KeyframeAnimationOptions
     */
    open(animationOptions) {
        let startSize = 0;
        if (this.#animation?.playState === 'running') {
            /* アニメーションが終わらないうちに連続して `<summary>` 要素がクリックされた場合 */
            this.#animationCancel();
            startSize = this.blockSize;
        }
        this.#animate({
            orientation: 'open',
            startSize: startSize,
            endSize: this.scrollBlockSize,
            options: animationOptions,
        });
    }
    /**
     * Close contents area
     *
     * @param animationOptions - KeyframeAnimationOptions
     */
    close(animationOptions) {
        if (this.#animation?.playState === 'running') {
            /* アニメーションが終わらないうちに連続して `<summary>` 要素がクリックされた場合 */
            this.#animationCancel();
        }
        this.#animate({
            orientation: 'close',
            startSize: this.blockSize,
            options: animationOptions,
        });
    }
    /**
     * Apply animation
     *
     * @param animation - Animation settings
     * @param animation.orientation - Orientation of animation ('open' or 'close')
     * @param animation.startSize - Block size of the start of the animation
     * @param animation.endSize - Block size of the end of the animation
     * @param animation.options - KeyframeAnimationOptions
     */
    #animate(animation) {
        this.#animation = this.animate({
            [this.#writingMode === 'vertical' ? 'width' : 'height']: [`${String(animation.startSize ?? 0)}px`, `${String(animation.endSize ?? 0)}px`],
        }, animation.options);
        this.#animation.addEventListener('finish', () => {
            this.#clearStyles();
            const eventDetail = {
                orientation: animation.orientation,
            };
            this.dispatchEvent(new CustomEvent('animation-finish', {
                detail: eventDetail,
            }));
        }, { passive: true, once: true });
    }
    /**
     * Cancel animation
     */
    #animationCancel() {
        this.#animation?.commitStyles();
        this.#animation?.cancel();
    }
    /**
     * Clear styles set by `Animation.commitStyles()`.
     */
    #clearStyles() {
        this.removeAttribute('style');
    }
}
//# sourceMappingURL=CustomElementDetailsContent.js.map