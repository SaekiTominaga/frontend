import shadowAppendCss from '@w0s/shadow-append-css';
import WritingMode from '@w0s/writing-mode';
import Duration from './attribute/Duration.js';
import Easing from './attribute/Easing.js';
/**
 * The additional information in a `<details>` element
 *
 * This is the same as `::details-content` pseudo-element <https://drafts.csswg.org/css-pseudo-4/#details-content-pseudo>
 */
export default class CustomElementDetailsContent extends HTMLElement {
    #writingMode;
    #animation;
    #duration;
    #easing;
    static get observedAttributes() {
        return ['duration', 'easing'];
    }
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
			<slot></slot>
		`;
        const cssString = `
			:host {
				display: block flow;
				overflow: hidden;
			}
		`;
        shadowAppendCss(shadow, cssString);
    }
    connectedCallback() {
        try {
            this.#writingMode = new WritingMode(this);
        }
        catch (e) {
            /* TODO: jsdom は `getComputedStyle()` で CSS の継承を認識しない https://github.com/jsdom/jsdom/issues/2160 */
        }
    }
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'duration': {
                this.duration = new Duration(newValue ?? undefined);
                break;
            }
            case 'easing': {
                this.easing = new Easing(newValue ?? undefined);
                break;
            }
            default:
        }
    }
    get duration() {
        return this.#duration;
    }
    set duration(duration) {
        this.#duration = duration;
    }
    get easing() {
        return this.#easing;
    }
    set easing(easing) {
        this.#easing = easing;
    }
    get #blockSize() {
        if (this.#writingMode === undefined) {
            return undefined;
        }
        return this.#writingMode.isHorizontal() ? this.clientHeight : this.clientWidth;
    }
    get #scrollBlockSize() {
        if (this.#writingMode === undefined) {
            return undefined;
        }
        return this.#writingMode.isHorizontal() ? this.scrollHeight : this.scrollWidth;
    }
    /**
     * Open contents area
     */
    open() {
        let startSize = 0;
        if (this.#animation?.playState === 'running') {
            /* アニメーションが終わらないうちに連続して `<summary>` 要素がクリックされた場合 */
            this.#animationCancel();
            startSize = this.#blockSize;
        }
        this.#animate('open', {
            startSize: startSize,
            endSize: this.#scrollBlockSize,
        });
    }
    /**
     * Close contents area
     */
    close() {
        if (this.#animation?.playState === 'running') {
            /* アニメーションが終わらないうちに連続して `<summary>` 要素がクリックされた場合 */
            this.#animationCancel();
        }
        this.#animate('close', {
            startSize: this.#blockSize,
            endSize: 0,
        });
    }
    /**
     * Apply animation
     *
     * @param orientation - Orientation of state
     * @param animation - Animation settings
     * @param animation.startSize - Block size of the start of the animation
     * @param animation.endSize - Block size of the end of the animation
     */
    #animate(orientation, animation) {
        if (window.matchMedia('(prefers-reduced-motion:reduce)').matches || animation.startSize === undefined || animation.endSize === undefined) {
            this.#duration = undefined;
        }
        const animationOptions = {};
        if (this.#duration?.value !== undefined) {
            animationOptions.duration = this.#duration.value;
        }
        if (this.#easing?.value !== undefined) {
            animationOptions.easing = this.#easing.value;
        }
        this.#animation = this.animate({
            [this.#writingMode?.isHorizontal() ? 'height' : 'width']: [`${String(animation.startSize ?? 0)}px`, `${String(animation.endSize ?? 0)}px`],
        }, animationOptions);
        this.#animation.addEventListener('finish', () => {
            this.#clearStyles();
            const eventDetail = {
                orientation: orientation,
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