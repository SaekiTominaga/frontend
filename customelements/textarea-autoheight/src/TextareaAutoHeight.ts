import HTMLElementUtil from './HTMLElementUtil.js';

/**
 * Automatically adjust the block size dimension of the `<textarea>` element to the input content
 */
export default class TextareaAutoheight extends HTMLTextAreaElement {
	connectedCallback(): void {
		this.#setBlockSize();
		this.addEventListener('input', this.#inputEvent, { passive: true });
	}

	disconnectedCallback(): void {
		this.removeEventListener('input', this.#inputEvent);
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
		return new HTMLElementUtil(this).getWritingMode() === 'vertical' ? this.scrollWidth : this.scrollHeight;
	}

	/**
	 * block-size を設定する
	 */
	#setBlockSize() {
		this.style.blockSize = 'unset';

		let blockSizePx = this.#getBlockSize();

		const textareaComputedStyle = getComputedStyle(this, '');
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

		this.style.blockSize = `${blockSizePx}px`;
	}
}
