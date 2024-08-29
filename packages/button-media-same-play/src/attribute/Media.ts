/**
 * `aria-controls` attribute
 */
export default class {
	readonly #elements: HTMLMediaElement[] = [];

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | undefined) {
		if (value === undefined) {
			throw new TypeError('The `aria-controls` attribute is not set.');
		}

		value.split(' ').forEach((id) => {
			const element = document.getElementById(id);
			if (element === null) {
				throw new Error(`Element \`#${id}\` not found.`);
			}

			this.#elements.push(element as HTMLMediaElement);
		});
	}

	get elements(): HTMLMediaElement[] {
		return this.#elements;
	}
}
