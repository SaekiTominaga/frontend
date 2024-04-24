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
	 * block-size を取得する
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
			case 'border-box': {
				const borderBlockStartWidthPx = Number(textareaComputedStyle.borderBlockStartWidth);
				if (!Number.isNaN(borderBlockStartWidthPx)) {
					blockSizePx += borderBlockStartWidthPx;
				}
				const borderBlockEndWidthPx = Number(textareaComputedStyle.borderBlockEndWidth);
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
