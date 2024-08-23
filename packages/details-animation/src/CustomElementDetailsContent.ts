import HTMLElementUtil, { type WritingMode } from './HTMLElementUtil.js';

export interface AnimationEndEventDetail {
	newState: 'open' | 'closed';
}

/**
 * The additional information in a `<details>` element
 *
 * This is the same as `::details-content` pseudo-element <https://drafts.csswg.org/css-pseudo-4/#details-content-pseudo>
 */
export default class CustomElementDetailsContent extends HTMLElement {
	#writingMode: WritingMode | undefined;

	#animation: Animation | null = null;

	constructor() {
		super();

		const cssString = `
			:host {
				display: block flow;
				overflow: hidden;
			}
		`;

		const shadow = this.attachShadow({ mode: 'open' });
		shadow.innerHTML = `
			<slot></slot>
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
	}

	connectedCallback(): void {
		this.#writingMode = new HTMLElementUtil(this).writingMode;
	}

	get blockSize(): number {
		return this.#writingMode === 'vertical' ? this.clientWidth : this.clientHeight;
	}

	get scrollBlockSize(): number {
		return this.#writingMode === 'vertical' ? this.scrollWidth : this.scrollHeight;
	}

	/**
	 * Open contents area
	 *
	 * @param animationOptions - KeyframeAnimationOptions
	 */
	open(animationOptions: KeyframeAnimationOptions): void {
		let startSize = 0;
		if (this.#animation?.playState === 'running') {
			/* アニメーションが終わらないうちに連続して `<summary>` 要素がクリックされた場合 */
			this.#animationCancel();

			startSize = this.blockSize;
		}

		this.#animate(startSize, this.scrollBlockSize, animationOptions);
	}

	/**
	 * Close contents area
	 *
	 * @param animationOptions - KeyframeAnimationOptions
	 */
	close(animationOptions: KeyframeAnimationOptions): void {
		if (this.#animation?.playState === 'running') {
			/* アニメーションが終わらないうちに連続して `<summary>` 要素がクリックされた場合 */
			this.#animationCancel();
		}

		this.#animate(this.blockSize, 0, animationOptions);
	}

	/**
	 * Close contents area
	 *
	 * @param startSize - Block size of the start of the animation
	 * @param endSize - Block size of the end of the animation
	 * @param animationOptions - KeyframeAnimationOptions
	 */
	#animate(startSize: number, endSize: number, animationOptions: KeyframeAnimationOptions): void {
		this.#animation = this.animate(
			{
				[this.#writingMode === 'vertical' ? 'width' : 'height']: [`${String(startSize)}px`, `${String(endSize)}px`],
			},
			animationOptions,
		);

		this.#animation.addEventListener(
			'finish',
			() => {
				this.#clearStyles();

				const eventDetail: AnimationEndEventDetail = {
					newState: endSize === 0 ? 'closed' : 'open',
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
