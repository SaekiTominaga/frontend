/**
 * Tooltip UI
 */
export default class TooltipTrigger extends HTMLAnchorElement {
	#footnoteElement?: HTMLElement; // 脚注要素（ツールチップの内容をここからコピーする）

	#tooltipId?: string;

	#tooltipWrapElement?: HTMLElement;

	#tooltipElement?: HTMLDialogElement;

	readonly #tooltipIdPrefix = 'tooltip-'; // ツールチップに設定する ID の接頭辞

	#mouseenterTimeoutId?: NodeJS.Timeout; // ツールチップを表示する際のタイマーの識別 ID（clearTimeout() で使用）

	#mouseleaveTimeoutId?: NodeJS.Timeout; // ツールチップを非表示にする際のタイマーの識別 ID（clearTimeout() で使用）

	#tooltipLabel?: string; // ツールチップに設定するラベル

	#tooltipClass?: string; // ツールチップに設定するクラス名

	#tooltipCloseText = 'Close'; // ツールチップの閉じるボタンのテキスト

	#tooltipCloseImageSrc: string | undefined; // ツールチップの閉じるボタンの画像パス

	#tooltipMouseenterDelay = 250; // mouseenter 時にツールチップを表示する遅延時間（ミリ秒）

	#tooltipMouseleaveDelay = 250; // mouseleave 時にツールチップを非表示にする遅延時間（ミリ秒）

	readonly #tooltipCloseEventListener: () => void;

	readonly #tooltipKeydownEventListener: (ev: KeyboardEvent) => void;

	constructor() {
		super();

		this.#tooltipCloseEventListener = this.#tooltipCloseEvent.bind(this);
		this.#tooltipKeydownEventListener = this.#tooltipKeydownEvent.bind(this);
	}

	connectedCallback(): void {
		const footnoteUrl = new URL(this.href);
		const footnoteId = footnoteUrl.hash.substring(1);
		if (footnoteUrl.origin !== location.origin || footnoteUrl.pathname !== location.pathname) {
			throw new Error('Attribute: `href` is not set or the value is invalid.');
		}
		const footnoteElement = document.getElementById(footnoteId);
		if (footnoteElement === null) {
			throw new Error(`Element: ${footnoteId} can not found.`);
		}
		this.#footnoteElement = footnoteElement;

		this.#tooltipId = `${this.#tooltipIdPrefix}${footnoteId}`;

		const { tooltipLabel, tooltipClass, tooltipCloseText, tooltipCloseImageSrc, tooltipMouseenterDelay, tooltipMouseleaveDelay } = this.dataset;

		if (tooltipLabel !== undefined) {
			this.#tooltipLabel = tooltipLabel;
		}

		if (tooltipClass !== undefined) {
			this.#tooltipClass = tooltipClass;
		}

		if (tooltipCloseText !== undefined) {
			this.#tooltipCloseText = tooltipCloseText;
		}

		this.#tooltipCloseImageSrc = tooltipCloseImageSrc;

		if (tooltipMouseenterDelay !== undefined) {
			this.#tooltipMouseenterDelay = Number(tooltipMouseenterDelay);
		}

		if (tooltipMouseleaveDelay !== undefined) {
			this.#tooltipMouseleaveDelay = Number(tooltipMouseleaveDelay);
		}

		this.setAttribute('role', 'button');
		this.setAttribute('aria-controls', this.#tooltipId);
		this.setAttribute('aria-expanded', 'false');

		this.addEventListener('mouseenter', this.#mouseEnterEvent, { passive: true });
		this.addEventListener('mouseleave', this.#mouseLeaveEvent, { passive: true });
		this.addEventListener('click', this.#clickEvent);

		/* Image preload */
		if (
			tooltipCloseImageSrc !== undefined &&
			!tooltipCloseImageSrc.trimStart().startsWith('data:') &&
			document.querySelector(`link[rel="preload"][href="${tooltipCloseImageSrc}"]`) === null
		) {
			const preloadElement = document.createElement('link');
			preloadElement.rel = 'preload';
			preloadElement.as = 'image';
			preloadElement.href = tooltipCloseImageSrc;

			const alreadyHeadLinkElements = document.head.querySelectorAll('link');
			if (alreadyHeadLinkElements.length === 0) {
				document.head.appendChild(preloadElement);
			} else {
				alreadyHeadLinkElements.item(alreadyHeadLinkElements.length - 1).insertAdjacentElement('afterend', preloadElement);
			}
		}
	}

	disconnectedCallback(): void {
		this.#tooltipElement?.remove();

		this.removeEventListener('mouseenter', this.#mouseEnterEvent);
		this.removeEventListener('mouseleave', this.#mouseLeaveEvent);
		this.removeEventListener('click', this.#clickEvent);
	}

	#mouseEnterEvent = (): void => {
		clearTimeout(this.#mouseleaveTimeoutId);

		this.#mouseenterTimeoutId = setTimeout((): void => {
			this.#show();
		}, this.#tooltipMouseenterDelay);
	};

	#mouseLeaveEvent = (): void => {
		clearTimeout(this.#mouseenterTimeoutId);

		this.#mouseleaveTimeoutId = setTimeout((): void => {
			this.#tooltipElement?.dispatchEvent(new Event('close'));
		}, this.#tooltipMouseleaveDelay);
	};

	#clickEvent = (ev: MouseEvent): void => {
		clearTimeout(this.#mouseleaveTimeoutId);

		this.#show({
			focus: true,
		});

		ev.preventDefault();
	};

	#tooltipCloseEvent(): void {
		this.setAttribute('aria-expanded', 'false');

		if (this.#tooltipWrapElement !== undefined) {
			this.#tooltipWrapElement.hidden = true;
		}
		document.removeEventListener('keydown', this.#tooltipKeydownEventListener);
	}

	#tooltipKeydownEvent(ev: KeyboardEvent): void {
		switch (ev.key) {
			case 'Escape': {
				ev.preventDefault();

				clearTimeout(this.#mouseenterTimeoutId);

				this.#tooltipElement?.dispatchEvent(new Event('close'));

				break;
			}
			default:
		}
	}

	/**
	 * ツールチップを生成する
	 */
	#create(): void {
		if (this.#footnoteElement === undefined) {
			throw new Error('Footnote element is not defined.');
		}

		const tooltipWrapElement = document.createElement('x-tooltip');
		tooltipWrapElement.hidden = true;
		document.body.appendChild(tooltipWrapElement);
		this.#tooltipWrapElement = tooltipWrapElement;

		const tooltipElement = document.createElement('dialog');
		if (this.#tooltipId !== undefined) {
			tooltipElement.id = this.#tooltipId;
		}
		if (this.#tooltipClass !== undefined) {
			tooltipElement.className = this.#tooltipClass;
		}
		tooltipElement.tabIndex = 0;
		if (this.#tooltipLabel !== undefined) {
			tooltipElement.setAttribute('aria-label', this.#tooltipLabel);
		}
		tooltipElement.insertAdjacentHTML('afterbegin', this.#footnoteElement.innerHTML);
		for (const element of tooltipElement.querySelectorAll('[id]')) {
			/* コピー元の HTML 中に id 属性が設定されていた場合、ページ中に ID が重複してしまうのを防ぐ */
			element.removeAttribute('id');
		}
		tooltipElement.addEventListener('close', this.#tooltipCloseEventListener, { passive: true });
		tooltipElement.addEventListener(
			'mouseenter',
			() => {
				clearTimeout(this.#mouseleaveTimeoutId);

				this.#mouseenterTimeoutId = setTimeout((): void => {
					this.#show();
				}, this.#tooltipMouseenterDelay);
			},
			{ passive: true },
		);
		tooltipElement.addEventListener(
			'mouseleave',
			() => {
				clearTimeout(this.#mouseenterTimeoutId);

				this.#mouseleaveTimeoutId = setTimeout((): void => {
					this.#tooltipElement?.dispatchEvent(new Event('close'));
				}, this.#tooltipMouseleaveDelay);
			},
			{ passive: true },
		);
		tooltipWrapElement.appendChild(tooltipElement);
		this.#tooltipElement = tooltipElement;

		const formElement = document.createElement('form');
		formElement.method = 'dialog';
		tooltipElement.appendChild(formElement);

		const closeButtonElement = document.createElement('button');
		if (this.#tooltipCloseImageSrc === undefined) {
			closeButtonElement.textContent = this.#tooltipCloseText;
		} else {
			const closeButtonImageElement = document.createElement('img');
			closeButtonImageElement.src = this.#tooltipCloseImageSrc;
			closeButtonImageElement.alt = this.#tooltipCloseText;
			closeButtonElement.appendChild(closeButtonImageElement);
		}
		formElement.appendChild(closeButtonElement);

		/* 循環フォーカス */
		const firstFocusableElement = document.createElement('span');
		firstFocusableElement.tabIndex = 0;
		firstFocusableElement.addEventListener(
			'focus',
			() => {
				closeButtonElement.focus();
			},
			{ passive: true },
		);
		tooltipWrapElement.insertAdjacentElement('afterbegin', firstFocusableElement);

		const lastFocusableElement = document.createElement('span');
		lastFocusableElement.tabIndex = 0;
		lastFocusableElement.addEventListener(
			'focus',
			() => {
				tooltipElement.focus();
			},
			{ passive: true },
		);
		tooltipWrapElement.insertAdjacentElement('beforeend', lastFocusableElement);
	}

	/**
	 * ツールチップを表示する
	 *
	 * @param options - オプション
	 * @param options.focus - ツールチップにフォーカスを行うか
	 */
	#show(options: { focus: boolean } = { focus: false }): void {
		if (this.#tooltipElement === undefined) {
			/* 初回表示時はツールチップの生成を行う */
			this.#create();
		}

		const tooltipElement = this.#tooltipElement;
		if (tooltipElement === undefined) {
			throw new Error('Tooltip element is not generated.');
		}

		this.setAttribute('aria-expanded', 'true');

		/* 表示位置を設定する */
		const triggerRect = this.getBoundingClientRect();

		/* ツールチップの上位置を設定（トリガー要素の下端を基準にする） */
		tooltipElement.style.top = `${String(Math.round(triggerRect.bottom) + window.pageYOffset)}px`;

		tooltipElement.show();
		if (this.#tooltipWrapElement !== undefined) {
			this.#tooltipWrapElement.hidden = false;
		}
		document.addEventListener('keydown', this.#tooltipKeydownEventListener);

		const documentWidth = document.documentElement.offsetWidth;
		const tooltipWidth = tooltipElement.getBoundingClientRect().width;

		/* ツールチップの左右位置を設定（トリガー要素の左端を基準にする） */
		/* いったんリセット */
		tooltipElement.style.left = 'auto';
		tooltipElement.style.right = 'auto';

		/* 設定 */
		if (documentWidth - triggerRect.left < tooltipWidth) {
			tooltipElement.style.right = '0';
		} else {
			tooltipElement.style.left = `${String(Math.round(triggerRect.left))}px`;
		}

		if (options.focus) {
			tooltipElement.focus(); // TODO: 将来的には show() のパラメーターで指定できるようになる? https://github.com/whatwg/html/wiki/dialog--initial-focus,-a-proposal#initial-dialog-focus-logic
		}
	}
}
