/**
 * Footnote reference popover
 */
export default class {
	readonly #popoverTriggerElement: HTMLAnchorElement;

	readonly #footnoteElement: HTMLElement; // 脚注要素（ポップオーバーの内容をここからコピーする）

	readonly #popoverId: string;

	readonly #popoverWrapElement: HTMLElement;

	readonly #popoverElement: HTMLElement;

	readonly #popoverIdPrefix = 'popover-'; // ポップオーバーに設定する ID の接頭辞

	readonly #popoverLabel: string | undefined; // ポップオーバーに設定するラベル

	readonly #popoverClass: string | undefined; // ポップオーバーに設定するクラス名

	readonly #popoverHideText: string = 'Close'; // ポップオーバーの閉じるボタンのテキスト

	readonly #popoverHideImageSrc: string | undefined; // ポップオーバーの閉じるボタンの画像パス

	readonly #popoverMouseenterDelay: number = 250; // mouseenter 時にポップオーバーを表示する遅延時間（ミリ秒）

	readonly #popoverMouseleaveDelay: number = 250; // mouseleave 時にポップオーバーを非表示にする遅延時間（ミリ秒）

	#mouseenterTimeoutId?: NodeJS.Timeout; // ポップオーバーを表示する際のタイマーの識別 ID（clearTimeout() で使用）

	#mouseleaveTimeoutId?: NodeJS.Timeout; // ポップオーバーを非表示にする際のタイマーの識別 ID（clearTimeout() で使用）

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLAnchorElement) {
		this.#popoverTriggerElement = thisElement;

		const { href } = thisElement;
		const {
			popoverLabel,
			popoverClass,
			popoverCloseText: popoverHideText,
			popoverCloseImageSrc: popoverHideImageSrc,
			popoverMouseenterDelay,
			popoverMouseleaveDelay,
		} = thisElement.dataset;

		if (href === '') {
			throw new Error('Attribute: `href` is not set.');
		}

		const footnoteUrl = new URL(href);
		if (footnoteUrl.origin !== location.origin || footnoteUrl.pathname !== location.pathname) {
			throw new Error('Attribute: `href` value must be in the same content.');
		}

		const footnoteId = footnoteUrl.hash.substring(1);
		const footnoteElement = document.getElementById(footnoteId);
		if (footnoteElement === null) {
			throw new Error(`Element: #${footnoteId} can not found.`);
		}
		this.#footnoteElement = footnoteElement;

		this.#popoverId = `${this.#popoverIdPrefix}${footnoteId}`;
		this.#popoverLabel = popoverLabel;
		this.#popoverClass = popoverClass;
		if (popoverHideText !== undefined) {
			this.#popoverHideText = popoverHideText;
		}
		this.#popoverHideImageSrc = popoverHideImageSrc;
		if (popoverMouseenterDelay !== undefined) {
			this.#popoverMouseenterDelay = Number(popoverMouseenterDelay);
		}
		if (popoverMouseleaveDelay !== undefined) {
			this.#popoverMouseleaveDelay = Number(popoverMouseleaveDelay);
		}

		this.#popoverWrapElement = document.createElement('x-popover');
		this.#popoverElement = document.createElement('div');

		if (!('popover' in thisElement)) {
			/* Firefox 123-, Safari 16.6-, Chrome 113- <https://caniuse.com/mdn-api_htmlelement_popover> */
			console.warn('Your browser does not support the Popover API.');
			return;
		}

		thisElement.setAttribute('role', 'button');
		thisElement.setAttribute('aria-controls', this.#popoverId);
		thisElement.setAttribute('aria-expanded', 'false');

		thisElement.addEventListener('mouseenter', this.#mouseEnterEvent, { passive: true });
		thisElement.addEventListener('mouseleave', this.#mouseLeaveEvent, { passive: true });
		thisElement.addEventListener('click', this.#clickEvent);

		/* Image preload */
		if (
			popoverHideImageSrc !== undefined &&
			!popoverHideImageSrc.trimStart().startsWith('data:') &&
			document.querySelector(`link[rel="preload"][href="${popoverHideImageSrc}"]`) === null
		) {
			const preloadElement = document.createElement('link');
			preloadElement.rel = 'preload';
			preloadElement.as = 'image';
			preloadElement.href = popoverHideImageSrc;

			const alreadyHeadLinkElements = document.head.querySelectorAll('link');
			if (alreadyHeadLinkElements.length === 0) {
				document.head.appendChild(preloadElement);
			} else {
				[...alreadyHeadLinkElements].at(-1)?.insertAdjacentElement('afterend', preloadElement);
			}
		}
	}

	/**
	 * Trigger element `mouseenter` event
	 */
	#mouseEnterEvent = (): void => {
		clearTimeout(this.#mouseleaveTimeoutId);

		this.#mouseenterTimeoutId = setTimeout((): void => {
			this.#show();
		}, this.#popoverMouseenterDelay);
	};

	/**
	 * Trigger element `mouseleave` event
	 */
	#mouseLeaveEvent = (): void => {
		clearTimeout(this.#mouseenterTimeoutId);

		this.#mouseleaveTimeoutId = setTimeout((): void => {
			this.#popoverElement.hidePopover();
		}, this.#popoverMouseleaveDelay);
	};

	/**
	 * Trigger element `click` event
	 *
	 * @param ev - MouseEvent
	 */
	#clickEvent = (ev: MouseEvent): void => {
		ev.preventDefault();

		clearTimeout(this.#mouseleaveTimeoutId);

		this.#show();
	};

	/**
	 * Popover element `beforetoggle` event
	 *
	 * @param ev - Event
	 */
	#beforeToggleEvent = (ev: Event): void => {
		this.#popoverWrapElement.hidden = (ev as ToggleEvent).newState !== 'open';
	};

	/**
	 * Popover element `toggle` event
	 *
	 * @param ev - Event
	 */
	#toggleEvent = (ev: Event): void => {
		this.#popoverTriggerElement.setAttribute('aria-expanded', (ev as ToggleEvent).newState === 'open' ? 'true' : 'false');
	};

	/**
	 * ポップオーバーを生成する
	 */
	#create(): void {
		const popoverWrapElement = this.#popoverWrapElement;
		popoverWrapElement.hidden = true;
		document.body.appendChild(popoverWrapElement);

		const popoverElement = this.#popoverElement;
		popoverElement.popover = 'auto';
		popoverElement.style.position = 'absolute';
		popoverElement.style.margin = '0';
		popoverElement.id = this.#popoverId;
		popoverElement.tabIndex = -1;
		popoverElement.autofocus = true;
		if (this.#popoverClass !== undefined) {
			popoverElement.className = this.#popoverClass;
		}
		if (this.#popoverLabel !== undefined) {
			popoverElement.setAttribute('aria-label', this.#popoverLabel);
		}
		popoverElement.insertAdjacentHTML('afterbegin', this.#footnoteElement.innerHTML);
		popoverWrapElement.appendChild(popoverElement);

		for (const element of popoverElement.querySelectorAll('[id]')) {
			/* コピー元の HTML 中に id 属性が設定されていた場合、ページ中に ID が重複してしまうのを防ぐ */
			element.removeAttribute('id');
		}

		popoverElement.addEventListener('beforetoggle', this.#beforeToggleEvent, { passive: true });
		popoverElement.addEventListener('toggle', this.#toggleEvent, { passive: true });
		popoverElement.addEventListener(
			'mouseenter',
			() => {
				clearTimeout(this.#mouseleaveTimeoutId);

				this.#mouseenterTimeoutId = setTimeout((): void => {
					this.#show();
				}, this.#popoverMouseenterDelay);
			},
			{ passive: true },
		);
		popoverElement.addEventListener(
			'mouseleave',
			() => {
				clearTimeout(this.#mouseenterTimeoutId);

				this.#mouseleaveTimeoutId = setTimeout((): void => {
					this.#popoverElement.hidePopover();
				}, this.#popoverMouseleaveDelay);
			},
			{ passive: true },
		);

		const hideButtonElement = document.createElement('button');
		hideButtonElement.type = 'button';
		hideButtonElement.popoverTargetElement = popoverElement;
		hideButtonElement.popoverTargetAction = 'hide';
		if (this.#popoverHideImageSrc === undefined) {
			hideButtonElement.textContent = this.#popoverHideText;
		} else {
			const imageElement = document.createElement('img');
			imageElement.src = this.#popoverHideImageSrc;
			imageElement.alt = this.#popoverHideText;
			hideButtonElement.appendChild(imageElement);
		}
		popoverElement.appendChild(hideButtonElement);

		/* 循環フォーカス */
		const firstFocusableElement = document.createElement('span');
		firstFocusableElement.tabIndex = 0;
		firstFocusableElement.addEventListener(
			'focus',
			() => {
				hideButtonElement.focus();
			},
			{ passive: true },
		);
		popoverWrapElement.insertAdjacentElement('afterbegin', firstFocusableElement);

		const lastFocusableElement = document.createElement('span');
		lastFocusableElement.tabIndex = 0;
		lastFocusableElement.addEventListener(
			'focus',
			() => {
				popoverElement.focus();
			},
			{ passive: true },
		);
		popoverWrapElement.insertAdjacentElement('beforeend', lastFocusableElement);
	}

	/**
	 * ポップオーバーを表示する
	 */
	#show(): void {
		const popoverElement = this.#popoverElement;
		if (!popoverElement.isConnected) {
			/* 初回表示時はポップオーバーの生成を行う */
			this.#create();
		}

		const triggerRect = this.#popoverTriggerElement.getBoundingClientRect();

		/* ポップオーバーの上位置を設定（トリガー要素の下端を基準にする） */
		popoverElement.style.top = `${String(Math.round(triggerRect.bottom) + window.pageYOffset)}px`;

		/* ポップオーバーを表示 */
		popoverElement.showPopover();

		/* ポップオーバーの左右位置を設定（トリガー要素の左端を基準にする） */
		const documentWidth = document.documentElement.offsetWidth;
		const popoverWidth = popoverElement.getBoundingClientRect().width;

		popoverElement.style.left = 'auto';
		popoverElement.style.right = 'auto';

		if (documentWidth - triggerRect.left < popoverWidth) {
			popoverElement.style.right = '0';
		} else {
			popoverElement.style.left = `${String(Math.round(triggerRect.left))}px`;
		}
	}
}
