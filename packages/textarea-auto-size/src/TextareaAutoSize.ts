import HTMLElementUtil from './HTMLElementUtil.js';

/**
 * Automatically adjust the block size dimension of the `<textarea>` element to the input content
 */
export default class {
	readonly #textareaElement: HTMLTextAreaElement;

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLTextAreaElement) {
		this.#textareaElement = thisElement;

		this.#setBlockSize();

		thisElement.addEventListener('input', this.#inputEvent, { passive: true });
	}

	/**
	 * 入力時の処理
	 */
	#inputEvent = (): void => {
		this.#setBlockSize();
	};

	/**
	 * block-size を取得する（padding を含み、margin, border は含まない）
	 *
	 * @returns block-size
	 */
	#getBlockSize(): number {
		return new HTMLElementUtil(this.#textareaElement).getWritingMode() === 'vertical' ? this.#textareaElement.scrollWidth : this.#textareaElement.scrollHeight;
	}

	/**
	 * block-size を設定する
	 */
	#setBlockSize() {
		this.#textareaElement.style.blockSize = 'unset';

		let blockSizePx = this.#getBlockSize();

		const textareaComputedStyle = getComputedStyle(this.#textareaElement, '');
		switch (textareaComputedStyle.boxSizing) {
			case 'content-box': {
				const paddingBlockStartPx = Number.parseInt(textareaComputedStyle.paddingBlockStart, 10);
				if (!Number.isNaN(paddingBlockStartPx)) {
					blockSizePx -= paddingBlockStartPx;
				}
				const paddingBlockEndPx = Number.parseInt(textareaComputedStyle.paddingBlockEnd, 10);
				if (!Number.isNaN(paddingBlockEndPx)) {
					blockSizePx -= paddingBlockEndPx;
				}
				break;
			}
			case 'border-box': {
				const borderBlockStartWidthPx = Number.parseInt(textareaComputedStyle.borderBlockStartWidth, 10);
				if (!Number.isNaN(borderBlockStartWidthPx)) {
					blockSizePx += borderBlockStartWidthPx;
				}
				const borderBlockEndWidthPx = Number.parseInt(textareaComputedStyle.borderBlockEndWidth, 10);
				if (!Number.isNaN(borderBlockEndWidthPx)) {
					blockSizePx += borderBlockEndWidthPx;
				}
				break;
			}
			default:
		}

		this.#textareaElement.style.blockSize = `${String(blockSizePx)}px`;
	}
}
