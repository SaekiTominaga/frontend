/**
 * `data-pre-open` attribute
 */
export default class {
	readonly #element: HTMLDetailsElement;

	/**
	 * @param element - `<details>` element
	 */
	constructor(element: HTMLDetailsElement) {
		this.#element = element;
	}

	get state(): boolean {
		return this.#element.dataset['preOpen'] === 'true';
	}

	set state(open: boolean) {
		this.#element.dataset['preOpen'] = String(open);
	}

	/**
	 * Toggle attribute values
	 */
	toggle(): void {
		this.#element.dataset['preOpen'] = String(this.#element.dataset['preOpen'] !== 'true');
	}
}
