/**
 * Tabs UI component
 */
export default class Tab extends HTMLElement {
	readonly #mySessionStorage: Storage | null = null;

	readonly #tablistElement: HTMLElement;

	#tabElements: HTMLAnchorElement[] = [];

	#tabpanelElements: HTMLElement[] = [];

	#selectedTabNo = 0; // 何番目のタブが選択されているか

	readonly #tabClickEventListener: (ev: MouseEvent) => void;

	readonly #tabKeydownEventListener: (ev: KeyboardEvent) => void;

	readonly #tabpanelKeydownEventListener: (ev: KeyboardEvent) => void;

	static get observedAttributes(): string[] {
		return ['tablist-label', 'storage-key'];
	}

	constructor() {
		super();

		try {
			this.#mySessionStorage = sessionStorage;
		} catch (e) {
			console.info('Storage access blocked.');
		}

		const cssString = `
			:host {
				display: block flow;
			}

			[part="tablist"] {
				display: block flex;
				align-items: flex-end;
			}

			[part="tablist"] ::slotted(*) {
				cursor: default;
			}

			[part="tabpanels"] ::slotted([aria-hidden="true"]) {
				display: none;
			}
		`;

		const shadow = this.attachShadow({ mode: 'open' });
		shadow.innerHTML = `
			<div part="tablist" role="tablist">
				<slot name="tab"></slot>
			</div>
			<div part="tabpanels">
				<slot name="tabpanel"></slot>
			</div>
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

		this.#tablistElement = shadow.querySelector('[part="tablist"]')!;
		this.#tabElements = shadow.querySelector<HTMLSlotElement>('slot[name="tab"]')!.assignedNodes({ flatten: true }) as HTMLAnchorElement[];
		this.#tabpanelElements = shadow.querySelector<HTMLSlotElement>('slot[name="tabpanel"]')!.assignedNodes({ flatten: true }) as HTMLElement[];

		this.#tabClickEventListener = this.#tabClickEvent.bind(this);
		this.#tabKeydownEventListener = this.#tabKeydownEvent.bind(this);
		this.#tabpanelKeydownEventListener = this.#tabpanelKeydownEvent.bind(this);
	}

	connectedCallback(): void {
		const { tablistLabel } = this;
		if (tablistLabel !== null) {
			this.#tablistElement.setAttribute('aria-label', tablistLabel);
		}

		this.#tabElements.forEach((tabElement): void => {
			const { href } = tabElement;
			if (href === '') {
				throw new Error('Attribute: `href` is not set.');
			}

			const { hash } = new URL(href);
			if (hash === '') {
				throw new Error('Attribute: `href` does not contain hash.');
			}

			const tabpanelElementId = decodeURIComponent(hash.substring(1));
			const tabpanelElement = document.getElementById(tabpanelElementId);
			if (tabpanelElement === null) {
				throw new Error(`Element: #${tabpanelElementId} can not found.`);
			}

			const tabElementId = crypto.randomUUID();

			tabElement.removeAttribute('href');
			tabElement.id = tabElementId;
			tabElement.setAttribute('role', 'tab');
			tabElement.setAttribute('aria-controls', tabpanelElementId);

			tabpanelElement.setAttribute('role', 'tabpanel');
			tabpanelElement.setAttribute('aria-labelledby', tabElementId);

			tabElement.addEventListener('click', this.#tabClickEventListener, { passive: true });
			tabElement.addEventListener('keydown', this.#tabKeydownEventListener);
			tabpanelElement.addEventListener('keydown', this.#tabpanelKeydownEventListener);
		});

		if (this.#mySessionStorage !== null) {
			const { storageKey } = this;
			if (storageKey !== null) {
				const initialSelectTabpanelId = this.#mySessionStorage.getItem(storageKey); // 前回選択したタブ ID
				if (initialSelectTabpanelId !== null) {
					const initialSelectTabpanelElement = document.getElementById(initialSelectTabpanelId);
					if (initialSelectTabpanelElement === null) {
						console.info(`Element: #${initialSelectTabpanelId} can not found.`);
					} else {
						this.#selectedTabNo = this.#tabpanelElements.indexOf(initialSelectTabpanelElement);
					}
				}
			}
		}

		this.#selectTab(this.#selectedTabNo);
	}

	disconnectedCallback(): void {
		for (const tabElement of this.#tabElements) {
			tabElement.removeEventListener('click', this.#tabClickEventListener);
			tabElement.removeEventListener('keydown', this.#tabKeydownEventListener);
		}

		for (const tabpanelElement of this.#tabpanelElements) {
			tabpanelElement.removeEventListener('keydown', this.#tabpanelKeydownEventListener);
		}
	}

	attributeChangedCallback(name: string, _oldValue: string, newValue: string): void {
		switch (name) {
			case 'tablist-label': {
				this.#tablistElement.setAttribute('aria-label', newValue);

				break;
			}
			case 'storage-key': {
				break;
			}
			default:
		}
	}

	get tablistLabel(): string | null {
		return this.getAttribute('tablist-label');
	}

	set tablistLabel(value: string | null) {
		if (value === null) {
			this.removeAttribute('tablist-label');
			return;
		}

		this.setAttribute('tablist-label', value);
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
	 * タブをクリックしたときの処理
	 *
	 * @param ev - Event
	 */
	#tabClickEvent(ev: MouseEvent): void {
		this.#changeTab(this.#tabElements.indexOf(ev.currentTarget as HTMLAnchorElement));
	}

	/**
	 * タブをキーボード操作したときの処理
	 *
	 * @param ev - Event
	 */
	#tabKeydownEvent(ev: KeyboardEvent): void {
		switch (ev.key) {
			case 'ArrowLeft':
			case 'ArrowUp': {
				ev.preventDefault();

				this.#changeTab(this.#selectedTabNo < 1 ? this.#tabElements.length - 1 : this.#selectedTabNo - 1);

				break;
			}
			case 'ArrowRight':
			case 'ArrowDown': {
				ev.preventDefault();

				this.#changeTab(this.#selectedTabNo >= this.#tabElements.length - 1 ? 0 : this.#selectedTabNo + 1);

				break;
			}
			case 'End': {
				ev.preventDefault();

				this.#changeTab(this.#tabElements.length - 1);

				break;
			}
			case 'Home': {
				ev.preventDefault();

				this.#changeTab(0);

				break;
			}
			default:
		}
	}

	/**
	 * タブパネルをキーボード操作したときの処理
	 *
	 * @param ev - Event
	 */
	#tabpanelKeydownEvent(ev: KeyboardEvent): void {
		switch (ev.key) {
			case 'ArrowLeft':
			case 'ArrowUp': {
				if (ev.ctrlKey) {
					/* Ctrl キーが同時に押下された場合は、選択中の [role="tab"] な要素にフォーカスを移動する */
					ev.preventDefault();

					this.#tabElements[this.#selectedTabNo]?.focus();
				}

				break;
			}
			default:
		}
	}

	/**
	 * タブを選択する
	 *
	 * @param tabNo - 選択するタブ番号
	 */
	#selectTab(tabNo: number): void {
		this.#tabElements.forEach((tabElement, index) => {
			const select = index === tabNo; // 選択されたタブかどうか

			tabElement.tabIndex = select ? 0 : -1;
			tabElement.setAttribute('aria-selected', String(select));
			tabElement.setAttribute('aria-expanded', String(select));

			this.#tabpanelElements[index]?.setAttribute('aria-hidden', String(!select));
		});

		this.#selectedTabNo = tabNo;
	}

	/**
	 * ユーザー操作によりタブを切り替える
	 *
	 * @param tabNo - 切り替えるタブ番号
	 */
	#changeTab(tabNo: number): void {
		this.#selectTab(tabNo);

		this.#tabElements[tabNo]?.focus();

		/* 現在選択中のタブ情報をストレージに保管する */
		if (this.#mySessionStorage !== null && this.storageKey !== null) {
			const tabpanelElement = this.#tabpanelElements[tabNo];
			if (tabpanelElement !== undefined) {
				this.#mySessionStorage.setItem(this.storageKey, tabpanelElement.id);
			}
		}
	}
}
