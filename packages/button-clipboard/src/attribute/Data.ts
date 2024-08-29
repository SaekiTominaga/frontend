/**
 * `data-text` or `data-target` attribute
 */
export default class {
	readonly #text: string | undefined;

	readonly #target: HTMLElement | undefined;

	/**
	 * @param value - Attribute value
	 * @param value.text - `data-text`
	 * @param value.target - `data-target`
	 */
	constructor(value: { text?: string | undefined; target?: string | undefined }) {
		if (value.text === undefined && value.target === undefined) {
			throw new TypeError('The `data-text` or `data-target` attribute is not set.');
		}

		if (value.text !== undefined) {
			this.#text = value.text;
		}

		if (value.target !== undefined) {
			const targetElement = document.getElementById(value.target);
			if (targetElement === null) {
				throw new Error(`Element \`#${value.target}\` not found.`);
			}

			this.#target = targetElement;
		}
	}

	get text(): string | undefined {
		return this.#text;
	}

	get element(): HTMLElement | undefined {
		return this.#target;
	}
}
