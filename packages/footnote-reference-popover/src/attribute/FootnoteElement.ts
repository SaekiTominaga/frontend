/**
 * `href` attribute
 */
export default class {
	readonly #element: HTMLElement;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined || value === '') {
			throw new TypeError('The `href` attribute is not set.');
		}

		let url: URL;
		try {
			url = new URL(value);
		} catch (e) {
			throw new TypeError('The value of the `href` attribute must be a URL.');
		}
		if (url.origin !== location.origin || url.pathname !== location.pathname) {
			throw new TypeError('The `href` attribute must be in the same content.');
		}

		const id = url.hash.substring(1);
		const footnoteElement = document.getElementById(id);
		if (footnoteElement === null) {
			throw new Error(`Element \`#${id}\` not found.`);
		}

		this.#element = footnoteElement;
	}

	get element(): HTMLElement {
		return this.#element;
	}
}
