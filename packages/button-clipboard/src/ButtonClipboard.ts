import HTMLElementUtil from './HTMLElementUtil.js';

/**
 * Clipboard write text button
 */
export default class {
	readonly #writeText: string | undefined;

	readonly #targetElement?: HTMLElement;

	readonly #feedbackElement?: HTMLElement;

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLButtonElement) {
		const { text: writeText, target: targetElementId, feedback: feedbackElementId } = thisElement.dataset;

		if (writeText === undefined && targetElementId === undefined) {
			throw new Error('Attribute: `data-text` or `data-target` is not set.');
		}

		this.#writeText = writeText;

		if (targetElementId !== undefined) {
			const targetElement = document.getElementById(targetElementId);
			if (targetElement === null) {
				throw new Error(`Element: #${targetElementId} can not found.`);
			}

			this.#targetElement = targetElement;
		}

		if (feedbackElementId !== undefined) {
			const feedbackElement = document.getElementById(feedbackElementId);
			if (feedbackElement === null) {
				throw new Error(`Element: #${feedbackElementId} can not found.`);
			}

			this.#feedbackElement = feedbackElement;
		}

		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		thisElement.addEventListener('click', this.#clickEvent, { passive: true });
	}

	/**
	 * ボタン押下時の処理
	 */
	#clickEvent = async (): Promise<void> => {
		const writeText = this.#writeText ?? new HTMLElementUtil(this.#targetElement!).getContent(); // data-text と data-target が両方指定されている場合は前者を優先する

		await navigator.clipboard.writeText(writeText);

		if (this.#feedbackElement !== undefined) {
			this.#feedbackElement.hidden = false;
		} else {
			console.info('Clipboard write successfully.', writeText);
		}
	};
}
