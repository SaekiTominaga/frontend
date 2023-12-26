/**
 * <input type="checkbox" role="switch">
 */
export default class InputSwitch extends HTMLElement {
	static formAssociated = true;

	static observedAttributes = ['value', 'checked', 'disabled', 'storage-key'];

	readonly #internals: ElementInternals | null = null;

	readonly #myLocalStorage: Storage | null = null;

	#initilalChecked = false;

	readonly #changeEventListener: (ev: Event) => void;

	readonly #clickEventListener: (ev: MouseEvent) => void;

	readonly #keydownEventListener: (ev: KeyboardEvent) => void;

	constructor() {
		super();

		try {
			this.#internals = this.attachInternals();
		} catch {
			// Safari 16.3- https://caniuse.com/mdn-api_htmlelement_attachinternals
		}

		try {
			this.#myLocalStorage = localStorage;
		} catch {
			console.info('Storage access blocked.');
		}

		const cssString = `
			:host {
				--switch-width: 3.6em;
				--switch-height: 1.8em;
				--switch-padding: 0.2em;
				--switch-bgcolor-on: #29f;
				--switch-bgcolor-off: #ccc;
				--switch-bgcolor-disabled-on: #666;
				--switch-bgcolor-disabled-off: #666;
				--switch-ball-color: #fff;
				--switch-animation-duration: 0.5s;
				--switch-outline-mouse-focus: none;

				display: inline-block;
				position: relative; /* for Safari 15.3- */
				contain: layout;
				min-width: var(--switch-width);
				min-height: var(--switch-height);
			}

			:host(:focus:not(:focus-visible)) {
				outline: var(--switch-outline-mouse-focus);
			}

			.slider {
				--switch-bgcolor: var(--switch-bgcolor-off);

				position: absolute;
				transition: background var(--switch-animation-duration);
				inset: 0;
				border-radius: var(--switch-height);
				background: var(--switch-bgcolor);
			}

			@supports not (inset: 0) {
				.slider {
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
				}
			}

			.slider::before {
				--switch-ball-diameter: calc(var(--switch-height) - var(--switch-padding) * 2);
				--switch-ball-transform: translateX(0);

				position: absolute;
				transform: var(--switch-ball-transform);
				transition: transform var(--switch-animation-duration);
				inset: var(--switch-padding);
				border-radius: 50%;
				background: var(--switch-ball-color);
				width: var(--switch-ball-diameter);
				height: var(--switch-ball-diameter);
				content: "";
			}

			@supports not (inset: 0) {
				.slider::before {
					top: var(--switch-padding);
					left: var(--switch-padding);
				}
			}

			:host([checked]) .slider {
				--switch-bgcolor: var(--switch-bgcolor-on);
			}

			:host([checked]) .slider::before {
				--switch-ball-transform: translateX(calc(var(--switch-width) - var(--switch-height)));
			}

			:host([disabled]) .slider {
				--switch-bgcolor: var(--switch-bgcolor-disabled-off);
			}

			:host([disabled][checked]) .slider {
				--switch-bgcolor: var(--switch-bgcolor-disabled-on);
			}
		`;

		const shadow = this.attachShadow({ mode: 'open' });
		shadow.innerHTML = `
			<span class="slider"></span>
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

		this.#changeEventListener = this.#changeEvent.bind(this);
		this.#clickEventListener = this.#clickEvent.bind(this);
		this.#keydownEventListener = this.#keydownEvent.bind(this);
	}

	connectedCallback(): void {
		const { checked, disabled, storageKey } = this;

		if (this.#myLocalStorage !== null) {
			if (storageKey !== null && storageKey !== '') {
				/* ストレージから前回アクセス時のチェック情報を取得する */
				const storageValue = this.#myLocalStorage.getItem(storageKey);
				switch (storageValue) {
					case 'true': {
						if (!checked) {
							this.checked = true;
						}
						break;
					}
					case 'false': {
						if (checked) {
							this.checked = false;
						}
						break;
					}
					default:
				}
			}
		}

		this.#internals?.setFormValue(this.checked ? this.value : null);
		this.#initilalChecked = checked;
		this.tabIndex = disabled ? -1 : 0;
		this.setAttribute('role', 'switch');
		this.setAttribute('aria-checked', String(checked));
		this.setAttribute('aria-disabled', String(disabled));

		if (!disabled) {
			this.addEventListener('change', this.#changeEventListener, { passive: true });
			this.addEventListener('click', this.#clickEventListener);
			this.addEventListener('keydown', this.#keydownEventListener);
		}
	}

	disconnectedCallback(): void {
		this.removeEventListener('change', this.#changeEventListener);
		this.removeEventListener('click', this.#clickEventListener);
		this.removeEventListener('keydown', this.#keydownEventListener);
	}

	attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
		switch (name) {
			case 'value': {
				break;
			}
			case 'checked': {
				const checked = newValue !== null;

				this.setAttribute('aria-checked', String(checked));

				break;
			}
			case 'disabled': {
				const disabled = newValue !== null;

				this.setAttribute('aria-disabled', String(disabled));

				if (disabled) {
					this.tabIndex = -1;

					this.removeEventListener('change', this.#changeEventListener);
					this.removeEventListener('click', this.#clickEventListener);
					this.removeEventListener('keydown', this.#keydownEventListener);

					this.blur();
				} else {
					this.tabIndex = 0;

					this.addEventListener('change', this.#changeEventListener, { passive: true });
					this.addEventListener('click', this.#clickEventListener);
					this.addEventListener('keydown', this.#keydownEventListener);
				}

				break;
			}
			case 'storage-key': {
				break;
			}
			default:
		}
	}

	formResetCallback(): void {
		if (this.checked !== this.#initilalChecked) {
			this.dispatchEvent(new Event('change'));
		}
	}

	get value(): string {
		return this.getAttribute('value') ?? 'on'; // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-default-on
	}

	set value(value: string | null) {
		if (value === null) {
			this.removeAttribute('value');
			return;
		}

		this.setAttribute('value', value);
	}

	get checked(): boolean {
		return this.getAttribute('checked') !== null;
	}

	set checked(value: boolean) {
		if (value) {
			this.setAttribute('checked', '');
		} else {
			this.removeAttribute('checked');
		}
	}

	get disabled(): boolean {
		return this.getAttribute('disabled') !== null;
	}

	set disabled(value: boolean) {
		if (value) {
			this.setAttribute('disabled', '');
		} else {
			this.removeAttribute('disabled');
		}
	}

	get storageKey(): string | null {
		return this.getAttribute('storage-key');
	}

	set storageKey(value: string | null) {
		if (value === null) {
			this.removeAttribute('storage-key');
			return;
		}

		this.setAttribute('storage-key', value);
	}

	/**
	 * スイッチの状態を変更する
	 */
	#changeEvent(): void {
		const { checked, storageKey } = this;

		this.checked = !checked;

		this.#internals?.setFormValue(this.checked ? this.value : null);

		if (this.#myLocalStorage !== null) {
			if (storageKey !== null && storageKey !== '') {
				/* スイッチのチェック情報をストレージに保管する */
				this.#myLocalStorage.setItem(storageKey, String(this.checked));
			}
		}
	}

	/**
	 * スイッチをクリックしたときの処理
	 *
	 * @param ev - Event
	 */
	#clickEvent(ev: MouseEvent): void {
		this.dispatchEvent(new Event('change'));
		ev.preventDefault();
	}

	/**
	 * スイッチにフォーカスした状態でキーボードが押された時の処理
	 *
	 * @param ev - Event
	 */
	#keydownEvent(ev: KeyboardEvent): void {
		switch (ev.key) {
			case ' ': {
				this.dispatchEvent(new Event('change'));
				ev.preventDefault();
				break;
			}
			default:
		}
	}
}
