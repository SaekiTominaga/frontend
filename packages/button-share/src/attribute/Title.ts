/**
 * `data-title` attribute
 */
export default class {
	readonly #text: string | undefined;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | undefined) {
		if (value === undefined) {
			return;
		}

		this.#text = value;
	}

	get text(): string | undefined {
		return this.#text;
	}
}
