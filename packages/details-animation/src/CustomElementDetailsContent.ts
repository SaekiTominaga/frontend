import shadowAppendCss from '@w0s/shadow-append-css';
import Duration from './attribute/Duration.js';
import Easing from './attribute/Easing.js';
import HTMLElementUtil, { type WritingMode } from './HTMLElementUtil.js';

type StateOrientation = 'open' | 'close';

export interface AnimationFinishEventDetail {
	orientation: StateOrientation;
}

/**
 * The additional information in a `<details>` element
 *
 * This is the same as `::details-content` pseudo-element <https://drafts.csswg.org/css-pseudo-4/#details-content-pseudo>
 */
export default class CustomElementDetailsContent extends HTMLElement {
	#writingMode: WritingMode | undefined;

	#animation: Animation | undefined;

	#duration: Duration | undefined;

	#easing: Easing | undefined;

	static get observedAttributes(): string[] {
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

	connectedCallback(): void {
		this.#writingMode = new HTMLElementUtil(this).writingMode;
	}

	attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
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

	get duration(): Duration | undefined {
		return this.#duration;
	}

	set duration(duration: Duration) {
		this.#duration = duration;
	}

	get easing(): Easing | undefined {
		return this.#easing;
	}

	set easing(easing: Easing) {
		this.#easing = easing;
	}

	get #blockSize(): number {
		return this.#writingMode === 'vertical' ? this.clientWidth : this.clientHeight;
	}

	get #scrollBlockSize(): number {
		return this.#writingMode === 'vertical' ? this.scrollWidth : this.scrollHeight;
	}

	/**
	 * Open contents area
	 */
	open(): void {
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
	close(): void {
		if (this.#animation?.playState === 'running') {
			/* アニメーションが終わらないうちに連続して `<summary>` 要素がクリックされた場合 */
			this.#animationCancel();
		}

		this.#animate('close', {
			startSize: this.#blockSize,
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
	#animate(orientation: StateOrientation, animation: { startSize?: number; endSize?: number }): void {
		if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
			this.#duration = undefined;
		}

		const animationOptions: KeyframeAnimationOptions = {};
		if (this.#duration?.value !== undefined) {
			animationOptions.duration = this.#duration.value;
		}
		if (this.#easing?.value !== undefined) {
			animationOptions.easing = this.#easing.value;
		}

		this.#animation = this.animate(
			{
				[this.#writingMode === 'vertical' ? 'width' : 'height']: [`${String(animation.startSize ?? 0)}px`, `${String(animation.endSize ?? 0)}px`],
			},
			animationOptions,
		);

		this.#animation.addEventListener(
			'finish',
			() => {
				this.#clearStyles();

				const eventDetail: AnimationFinishEventDetail = {
					orientation: orientation,
				};
				this.dispatchEvent(
					new CustomEvent('animation-finish', {
						detail: eventDetail,
					}),
				);
			},
			{ passive: true, once: true },
		);
	}

	/**
	 * Cancel animation
	 */
	#animationCancel(): void {
		this.#animation?.commitStyles();
		this.#animation?.cancel();
	}

	/**
	 * Clear styles set by `Animation.commitStyles()`.
	 */
	#clearStyles(): void {
		this.removeAttribute('style');
	}
}
