/**
 * `data-popover-label` attribute
 */
export default class {
	readonly #text: string | undefined;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined) {
			return;
		}

		this.#text = value;
	}

	get text(): string | undefined {
		return this.#text;
	}
}
