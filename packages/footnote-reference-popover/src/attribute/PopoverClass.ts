/**
 * `data-popover-class` attribute
 */
export default class {
	readonly #name: string | undefined;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined) {
			return;
		}

		this.#name = value;
	}

	get name(): string | undefined {
		return this.#name;
	}
}
