/**
 * `title` attribute
 */
export default class {
	readonly #value: string | undefined;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined) {
			return;
		}

		this.#value = value;
	}

	get value(): string | undefined {
		return this.#value;
	}
}
