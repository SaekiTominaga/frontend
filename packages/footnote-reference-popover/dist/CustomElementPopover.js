/**
 * Popover
 */
export default class CustomElementPopover extends HTMLElement {
    #contentElement;
    #firstFocusableElement;
    #lastFocusableElement;
    #hideButtonElement;
    #hideButtonImageElement;
    #hideText = 'Close';
    #customToggleEventListener;
    #firstFocusableFocusEventListener;
    #lastFocusableFocusEventListener;
    static get observedAttributes() {
        return ['label', 'hide-text', 'hide-image-src', 'hide-image-width', 'hide-image-height'];
    }
    constructor() {
        super();
        const cssString = `
			:host {
				position: absolute;
				contain: layout;
				margin: 0;
				border: none;
				padding: 0;
				overflow: visible;
			}

			[part="content"] {
				border: solid;
				padding: 0.25em;
			}

			[part="hide-button"] > img {
				display: block flow;
			}
		`;
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
			<span id="first-focusable" tabindex="0"></span>
			<div tabindex="-1" part="content">
				<slot></slot>
				<button type="button" popovertargetaction="hide" part="hide-button"></button>
			</div>
			<span id="last-focusable" tabindex="0"></span>
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
        this.#contentElement = shadow.querySelector('[part="content"]');
        this.#hideButtonElement = shadow.querySelector('[part="hide-button"]');
        this.#firstFocusableElement = shadow.getElementById('first-focusable');
        this.#lastFocusableElement = shadow.getElementById('last-focusable');
        this.#hideButtonImageElement = document.createElement('img');
        this.#hideButtonElement.textContent = this.#hideText;
        this.#customToggleEventListener = this.#customToggleEvent.bind(this);
        this.#firstFocusableFocusEventListener = this.#firstFocusableFocusEvent.bind(this);
        this.#lastFocusableFocusEventListener = this.#lastFocusableFocusEvent.bind(this);
    }
    connectedCallback() {
        this.popover = '';
        this.#hideButtonElement.popoverTargetElement = this;
        /* コピー元の HTML 中に id 属性が設定されていた場合、ページ中に ID が重複してしまうのを防ぐ */
        const hostElement = this.shadowRoot?.host;
        if (hostElement !== undefined) {
            for (const element of hostElement.querySelectorAll('[id]')) {
                element.removeAttribute('id');
            }
        }
        /* ポップオーバー状態変化 */
        this.addEventListener('my-toggle', this.#customToggleEventListener, { passive: true });
        /* 循環フォーカス */
        this.#firstFocusableElement.addEventListener('focus', this.#firstFocusableFocusEventListener, { passive: true });
        this.#lastFocusableElement.addEventListener('focus', this.#lastFocusableFocusEventListener, { passive: true });
    }
    disconnectedCallback() {
        /* ポップオーバー状態変化 */
        this.removeEventListener('my-toggle', this.#customToggleEventListener);
        /* 循環フォーカス */
        this.#firstFocusableElement.removeEventListener('focus', this.#firstFocusableFocusEventListener);
        this.#lastFocusableElement.removeEventListener('focus', this.#lastFocusableFocusEventListener);
    }
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'label': {
                this.label = newValue;
                break;
            }
            case 'hide-text': {
                this.hideText = newValue;
                break;
            }
            case 'hide-image-src': {
                this.hideImageSrc = newValue;
                break;
            }
            case 'hide-image-width': {
                this.hideImageWidth = Number(newValue);
                break;
            }
            case 'hide-image-height': {
                this.hideImageHeight = Number(newValue);
                break;
            }
            default:
        }
    }
    get label() {
        return this.ariaLabel;
    }
    set label(value) {
        this.ariaLabel = value;
    }
    get hideText() {
        return this.#hideText;
    }
    set hideText(value) {
        if (value === null) {
            return;
        }
        this.#hideText = value;
        this.#hideButtonElement.textContent = value;
        this.#hideButtonImageElement.alt = this.#hideText;
    }
    get hideImageSrc() {
        return this.#hideButtonImageElement.src;
    }
    set hideImageSrc(value) {
        if (value === null) {
            this.#hideButtonImageElement.removeAttribute('src');
            this.#hideButtonElement.textContent = this.#hideText;
            return;
        }
        this.#hideButtonImageElement.src = value;
        this.#hideButtonElement.textContent = '';
        this.#hideButtonElement.appendChild(this.#hideButtonImageElement);
    }
    get hideImageWidth() {
        return this.#hideButtonImageElement.width;
    }
    set hideImageWidth(value) {
        if (value === null) {
            this.#hideButtonImageElement.removeAttribute('width');
            return;
        }
        this.#hideButtonImageElement.width = value;
    }
    get hideImageHeight() {
        return this.#hideButtonImageElement.height;
    }
    set hideImageHeight(value) {
        if (value === null) {
            this.#hideButtonImageElement.removeAttribute('height');
            return;
        }
        this.#hideButtonImageElement.height = value;
    }
    get width() {
        return this.#contentElement.getBoundingClientRect().width;
    }
    /**
     * ポップオーバーの表示／非表示状態が変化したの処理
     *
     * @param ev - Event
     */
    #customToggleEvent(ev) {
        const detail = ev.detail;
        switch (detail.newState) {
            case 'open': {
                this.showPopover();
                if (detail.eventType === 'click') {
                    this.#contentElement.focus();
                }
                break;
            }
            case 'closed': {
                this.hidePopover();
                break;
            }
            default:
        }
    }
    /**
     * 最初の循環フォーカス要素にフォーカスされたときの処理
     */
    #firstFocusableFocusEvent() {
        this.#hideButtonElement.focus();
    }
    /**
     * 最後の循環フォーカス要素にフォーカスされたときの処理
     */
    #lastFocusableFocusEvent() {
        this.#contentElement.focus();
    }
}
//# sourceMappingURL=CustomElementPopover.js.map