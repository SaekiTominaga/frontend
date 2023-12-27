/**
 * Display a `confirm()` modal dialog when button is pressed
 */
export default class ButtonConfirm extends HTMLButtonElement {
	#message?: string;

	connectedCallback(): void {
		const { message } = this.dataset;

		if (message === undefined) {
			throw new Error('Attribute: `data-message` is not set.');
		}
		this.#message = message;

		this.addEventListener('click', this.#clickEvent);
	}

	disconnectedCallback(): void {
		this.removeEventListener('click', this.#clickEvent);
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
