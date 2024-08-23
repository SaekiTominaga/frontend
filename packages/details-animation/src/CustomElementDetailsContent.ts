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

	get animation(): Animation | null {
		return this.#animation;
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
	 * @param startBlockSize - Blosk size of the element surrounding the content before animation starts
	 * @param animationOptions - KeyframeAnimationOptions
	 */
	open(startBlockSize: number, animationOptions: KeyframeAnimationOptions): void {
		const endBlockSize = this.scrollBlockSize;

		this.#animation = this.animate(
			{
				[this.#writingMode === 'vertical' ? 'width' : 'height']: [`${String(startBlockSize)}px`, `${String(endBlockSize)}px`],
			},
			animationOptions,
		);

		this.#animation.addEventListener(
			'finish',
			() => {
				this.#clearStyles();

				const eventDetail: AnimationEndEventDetail = {
					newState: 'open',
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
	 * Close contents area
	 *
	 * @param animationOptions - KeyframeAnimationOptions
	 */
	close(animationOptions: KeyframeAnimationOptions): void {
		const startBlockSize = this.blockSize;

		this.#animation = this.animate(
			{
				[this.#writingMode === 'vertical' ? 'width' : 'height']: [`${String(startBlockSize)}px`, '0px'],
			},
			animationOptions,
		);

		this.#animation.addEventListener(
			'finish',
			() => {
				this.#clearStyles();

				const eventDetail: AnimationEndEventDetail = {
					newState: 'closed',
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
	animationCancel(): void {
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
