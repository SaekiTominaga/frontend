/**
 * `data-url` attribute
 */
export default class {
	readonly #url: URL | undefined;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined) {
			return;
		}

		try {
			this.#url = new URL(value);
		} catch (e) {
			throw new TypeError('The value of the `data-url` attribute must be a URL.');
		}
	}

	get url(): URL | undefined {
		return this.#url;
	}
}
