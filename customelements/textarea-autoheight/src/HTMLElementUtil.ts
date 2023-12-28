type WritingMode = 'horizontal' | 'vertical';

export default class HTMLElementUtil {
	readonly #element: HTMLElement;

	constructor(element: HTMLElement) {
		this.#element = element;
	}

	/**
	 * Gets the `writing-mode` state of the element
	 *
	 * @returns horizontal or vertical
	 */
	getWritingMode(): WritingMode {
		const { writingMode } = getComputedStyle(this.#element, '');

		switch (writingMode) {
			case 'vertical-rl':
			case 'vertical-lr':
			case 'sideways-rl':
			case 'sideways-lr': {
				return 'vertical';
			}
			default:
		}

		return 'horizontal';
	}
}
