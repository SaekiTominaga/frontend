import HTMLElementUtil from './HTMLElementUtil.js';

/**
 * Animating the `<details>` element
 */
export default class {
	readonly #detailsElement: HTMLDetailsElement; // `<details>` 要素

	readonly #detailsContentElement: HTMLElement; // `<details>` 要素内の `<summary>` 要素を除くコンテンツを囲う要素

	#detailsContentBlockSize: number | null = null; // コンテンツを囲う要素の高さ

	#animation: Animation | null = null;

	readonly #keyframeAnimationOptions: KeyframeAnimationOptions = {
		duration: 500,
		easing: 'ease',
	}; // https://developer.mozilla.org/en-US/docs/Web/API/Element/animate#parameters

	readonly #detailsToggleEventListener: () => void;

	readonly #summaryClickEventListener: (ev: Event) => void;

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLDetailsElement) {
		thisElement.dataset['preOpen'] = String(thisElement.open);
		this.#detailsElement = thisElement;

		const { duration, easing } = thisElement.dataset;
		if (duration !== undefined) {
			this.#keyframeAnimationOptions.duration = Number(duration);
		}
		if (easing !== undefined) {
			this.#keyframeAnimationOptions.easing = easing;
		}

		const summaryElement = thisElement.querySelector('summary');
		if (summaryElement === null) {
			throw new Error('Element `<details>` is missing a required instance of child element `<summary>`.');
		}

		/* <summary> を除くノードをラップする */
		const fragment = document.createDocumentFragment();
		let nextNode = summaryElement.nextSibling;
		while (nextNode !== null) {
			fragment.appendChild(nextNode);
			nextNode = summaryElement.nextSibling;
		}

		const detailsContentElement = document.createElement('div');
		detailsContentElement.style.overflow = 'hidden';
		detailsContentElement.appendChild(fragment);
		summaryElement.insertAdjacentElement('afterend', detailsContentElement);
		this.#detailsContentElement = detailsContentElement;

		this.#detailsToggleEventListener = this.#detailsToggleEvent.bind(this);
		this.#summaryClickEventListener = this.#summaryClickEvent.bind(this);

		thisElement.addEventListener('toggle', this.#detailsToggleEventListener);
		summaryElement.addEventListener('click', this.#summaryClickEventListener);
	}

	/**
	 * <details> 要素の開閉状態が変化した時の処理
	 */
	#detailsToggleEvent(): void {
		const open = String(this.#detailsElement.open);
		if (this.#detailsElement.dataset['preOpen'] !== open) {
			/* <summary> クリックを経ずに開閉状態が変化した場合（ブラウザのページ内検索など） */
			this.#detailsElement.dataset['preOpen'] = open;
		}
	}

	/**
	 * <summary> 要素をクリックしたときの処理
	 *
	 * @param ev - Event
	 */
	#summaryClickEvent(ev: Event): void {
		ev.preventDefault();

		const preOpen = this.#detailsElement.dataset['preOpen'] !== 'true';
		this.#detailsElement.dataset['preOpen'] = String(preOpen);

		if (this.#animation?.playState === 'running') {
			/* アニメーションが終わらないうちに連続して <summary> がクリックされた場合 */
			const blockSize = this.#getContentBlockSize();

			this.#detailsContentElement.style.blockSize = `${blockSize}px`;

			this.#animation.cancel();

			if (preOpen) {
				this.#open(blockSize);
			} else {
				this.#close();
			}
		} else {
			// eslint-disable-next-line no-lonely-if
			if (preOpen) {
				this.#open(0);
			} else {
				this.#close();
			}
		}
	}

	/**
	 * コンテンツエリアを開く処理
	 *
	 * @param startBlockSize - アニメーション開始前のコンテンツを囲う要素の高さ
	 */
	#open(startBlockSize: number): void {
		this.#detailsElement.open = true;

		const endBlockSize = this.#detailsContentBlockSize ?? this.#getContentBlockSize();

		this.#animation = this.#detailsContentElement.animate(
			{
				[new HTMLElementUtil(this.#detailsContentElement).getWritingMode() === 'horizontal' ? 'height' : 'width']: [`${startBlockSize}px`, `${endBlockSize}px`],
			},
			this.#keyframeAnimationOptions,
		);

		this.#animation.onfinish = () => {
			this.#detailsContentBlockSize = this.#getContentBlockSize();

			this.#detailsContentElement.style.blockSize = '';
		};
	}

	/**
	 * コンテンツエリアを閉じる処理
	 */
	#close(): void {
		const startBlockSize = this.#getContentBlockSize();
		this.#detailsContentBlockSize = startBlockSize;

		this.#animation = this.#detailsContentElement.animate(
			{
				[new HTMLElementUtil(this.#detailsContentElement).getWritingMode() === 'horizontal' ? 'height' : 'width']: [`${startBlockSize}px`, '0px'],
			},
			this.#keyframeAnimationOptions,
		);

		this.#animation.onfinish = () => {
			this.#detailsElement.open = false;

			this.#detailsContentBlockSize = null;

			this.#detailsContentElement.style.blockSize = '';
		};
	}

	/**
	 * block-size を取得する
	 *
	 * @returns block-size
	 */
	#getContentBlockSize(): number {
		const targetElement = this.#detailsContentElement;

		return new HTMLElementUtil(targetElement).getWritingMode() === 'vertical' ? targetElement.offsetWidth : targetElement.offsetHeight;
	}
}
