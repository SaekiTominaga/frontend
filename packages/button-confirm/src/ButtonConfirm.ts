/**
 * Display a `confirm()` modal dialog when button is pressed
 */
export default class {
	readonly #message: string;

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLButtonElement) {
		const { message } = thisElement.dataset;

		if (message === undefined) {
			throw new Error('Attribute: `data-message` is not set.');
		}
		this.#message = message;

		thisElement.addEventListener('click', this.#clickEvent);
	}

	/**
	 * ボタン押下時の処理
	 *
	 * @param ev - MouseEvent
	 */
	#clickEvent = (ev: MouseEvent) => {
		if (!confirm(this.#message)) {
			ev.preventDefault();
		}
	};
}
