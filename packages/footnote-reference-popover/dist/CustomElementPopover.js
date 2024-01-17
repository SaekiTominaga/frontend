/**
 * Popover
 */
export default class CustomElementPopover extends HTMLElement {
    #popoverElement;
    #hideButtonElement;
    #firstFocusableElement;
    #lastFocusableElement;
    #hideText = 'Close';
    #hideImageSrc = null;
    #toggleEventListener;
    #keydownEventListener;
    #firstFocusableFocusEventListener;
    #lastFocusableFocusEventListener;
    static get observedAttributes() {
        return ['label', 'hide-text', 'hide-image-src'];
    }
    constructor() {
        super();
        const cssString = `
			:host {
				position: absolute;
			}

			[part="popover"] {
				position: static;
				contain: layout;
				margin: 0;
			}

			[part="hide-button"] > img {
				display: block;
			}
		`;
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
			<span id="first-focusable" tabindex="0"></span>
			<dialog part="popover" autofocus="">
				<slot></slot>
				<form method="dialog">
					<button part="hide-button"></button>
				</form>
			</dialog>
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
        const shadowRoot = this.shadowRoot;
        this.#popoverElement = shadowRoot.querySelector('[part="popover"]');
        this.#hideButtonElement = shadowRoot.querySelector('[part="hide-button"]');
        this.#firstFocusableElement = shadowRoot.getElementById('first-focusable');
        this.#lastFocusableElement = shadowRoot.getElementById('last-focusable');
        this.#hideButtonElement.textContent = this.#hideText;
        this.#toggleEventListener = this.#toggleEvent.bind(this);
        this.#keydownEventListener = this.#keydownEvent.bind(this);
        this.#firstFocusableFocusEventListener = this.#firstFocusableFocusEvent.bind(this);
        this.#lastFocusableFocusEventListener = this.#lastFocusableFocusEvent.bind(this);
    }
    connectedCallback() {
        this.hidden = true;
        /* コピー元の HTML 中に id 属性が設定されていた場合、ページ中に ID が重複してしまうのを防ぐ */
        for (const element of this.shadowRoot.host.querySelectorAll('[id]')) {
            element.removeAttribute('id');
        }
        /* ポップオーバー状態変化 */
        this.addEventListener('toggle', this.#toggleEventListener, { passive: true });
        /* 循環フォーカス */
        this.#firstFocusableElement.addEventListener('focus', this.#firstFocusableFocusEventListener, { passive: true });
        this.#lastFocusableElement.addEventListener('focus', this.#lastFocusableFocusEventListener, { passive: true });
    }
    disconnectedCallback() {
        /* ポップオーバー状態変化 */
        this.removeEventListener('toggle', this.#toggleEventListener);
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
            default:
        }
    }
    get label() {
        return this.#popoverElement.ariaLabel;
    }
    set label(value) {
        this.#popoverElement.ariaLabel = value;
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
    }
    get hideImageSrc() {
        return this.#hideImageSrc;
    }
    set hideImageSrc(value) {
        this.#hideImageSrc = value;
        if (value === null) {
            this.#hideButtonElement.textContent = this.#hideText;
            return;
        }
        const newImageElement = document.createElement('img');
        newImageElement.src = value;
        newImageElement.alt = this.#hideText;
        this.#hideButtonElement.textContent = '';
        this.#hideButtonElement.appendChild(newImageElement);
    }
    get width() {
        return this.#popoverElement.getBoundingClientRect().width;
    }
    /**
     * ポップオーバーの表示／非表示状態が変化したの処理
     *
     * @param ev - CustomEvent
     */
    #toggleEvent(ev) {
        switch (ev.detail.newState) {
            case 'open': {
                this.hidden = false;
                this.#popoverElement.show();
                document.addEventListener('keydown', this.#keydownEventListener);
                break;
            }
            case 'closed': {
                this.hidden = true;
                this.#popoverElement.close();
                document.removeEventListener('keydown', this.#keydownEventListener);
                break;
            }
            default: {
                throw new Error('The value of `newState` must be either `open` or `closed`.');
            }
        }
    }
    /**
     * popover `keydown` event
     *
     * @param ev - KeyboardEvent
     */
    #keydownEvent(ev) {
        switch (ev.key) {
            case 'Escape': {
                ev.preventDefault();
                this.dispatchEvent(new CustomEvent('toggle', {
                    detail: {
                        newState: 'closed',
                    },
                }));
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
        this.#popoverElement.focus();
    }
}
//# sourceMappingURL=CustomElementPopover.js.map