/**
 * `data-validation-noexist`, `data-validation-min` and `data-validation-max` attribute
 */
export default class {
	readonly #noexist: string;

	readonly #min: string | undefined;

	readonly #max: string | undefined;

	/**
	 * @param value - Attribute value
	 * @param value.noexist - `data-validation-noexist`
	 * @param value.min - `data-validation-min`
	 * @param value.max - `data-validation-max`
	 * @param element - `<input>`
	 */
	constructor(value: { noexist: string | null | undefined; min: string | null | undefined; max: string | null | undefined }, element: HTMLInputElement) {
		if (value.noexist === null || value.noexist === undefined) {
			throw new TypeError('The `data-validation-noexist` attribute is not set.');
		}
		this.#noexist = value.noexist;

		if (element.min !== '') {
			if (value.min === null || value.min === undefined) {
				throw new TypeError('The `data-validation-min` attribute is not set.');
			}
			this.#min = value.min;
		}

		if (element.max !== '') {
			if (value.max === null || value.max === undefined) {
				throw new TypeError('The `data-validation-max` attribute is not set.');
			}
			this.#max = value.max;
		}
	}

	get noexist(): string {
		return this.#noexist;
	}

	get min(): string | undefined {
		return this.#min;
	}

	get max(): string | undefined {
		return this.#max;
	}
}
