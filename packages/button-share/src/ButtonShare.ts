/**
 * Share button
 */
export default class {
	readonly #text: string | undefined;

	readonly #title: string | undefined;

	readonly #url: string | undefined;

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLButtonElement) {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (navigator.share === undefined) {
			thisElement.disabled = true;
			return;
		}

		const { text, title, url } = thisElement.dataset;

		this.#text = text;
		this.#title = title;
		this.#url = url;

		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		thisElement.addEventListener('click', this.#clickEvent, { passive: true });
	}

	/**
	 * ボタン押下時の処理
	 */
	#clickEvent = async (): Promise<void> => {
		await navigator.share({
			// TODO: files
			text: this.#text ?? '',
			title: this.#title ?? document.title,
			url: this.#url ?? document.URL,
		});
	};
}
