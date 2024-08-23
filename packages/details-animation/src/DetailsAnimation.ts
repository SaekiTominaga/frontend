import CustomElementDetailsContent, { type AnimationEndEventDetail } from './CustomElementDetailsContent.js';

customElements.define('x-details-content', CustomElementDetailsContent);

/**
 * Animating the `<details>` element
 */
export default class {
	readonly #detailsElement: HTMLDetailsElement; // `<details>` 要素

	readonly #detailsContentElement: CustomElementDetailsContent; // `<details>` 要素内の `<summary>` 要素を除くコンテンツを囲う要素

	readonly #keyframeAnimationOptions: KeyframeAnimationOptions = {
		duration: 500,
		easing: 'ease',
	}; // https://developer.mozilla.org/en-US/docs/Web/API/Element/animate#parameters

	readonly #detailsToggleEventListener: () => void;

	readonly #summaryClickEventListener: (ev: Event) => void;

	readonly #detailsContentAnimationFinishEventListener: (ev: CustomEvent) => void;

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

		const detailsContentElement = document.createElement('x-details-content') as CustomElementDetailsContent;
		detailsContentElement.appendChild(fragment);
		summaryElement.insertAdjacentElement('afterend', detailsContentElement);
		this.#detailsContentElement = detailsContentElement;

		this.#detailsToggleEventListener = this.#detailsToggleEvent.bind(this);
		this.#summaryClickEventListener = this.#summaryClickEvent.bind(this);
		this.#detailsContentAnimationFinishEventListener = this.#detailsContentAnimationFinishEvent.bind(this);

		thisElement.addEventListener('toggle', this.#detailsToggleEventListener, { passive: true });
		summaryElement.addEventListener('click', this.#summaryClickEventListener);
		detailsContentElement.addEventListener('animation-finish', this.#detailsContentAnimationFinishEventListener as (ev: Event) => void, {
			passive: true,
		});
	}

	/**
	 * `<details>` 要素の開閉状態が変化した時の処理
	 */
	#detailsToggleEvent(): void {
		const open = String(this.#detailsElement.open);
		if (this.#detailsElement.dataset['preOpen'] !== open) {
			/* `<summary>` 要素のクリックを経ずに開閉状態が変化した場合（ブラウザのページ内検索など） */
			this.#detailsElement.dataset['preOpen'] = open;
		}
	}

	/**
	 * `<summary>` 要素をクリックしたときの処理
	 *
	 * @param ev - Event
	 */
	#summaryClickEvent(ev: Event): void {
		ev.preventDefault();

		const preOpen = this.#detailsElement.dataset['preOpen'] !== 'true';
		this.#detailsElement.dataset['preOpen'] = String(preOpen);

		if (preOpen) {
			this.#detailsElement.open = true;

			this.#detailsContentElement.open(this.#keyframeAnimationOptions);
		} else {
			this.#detailsContentElement.close(this.#keyframeAnimationOptions);
		}
	}

	/**
	 * 開閉アニメーションが終了したときの処理
	 *
	 * @param ev - Event
	 */
	#detailsContentAnimationFinishEvent(ev: CustomEvent): void {
		const detail = ev.detail as AnimationEndEventDetail;

		switch (detail.orientation) {
			case 'close': {
				this.#detailsElement.open = false;

				break;
			}
			default:
		}
	}
}
