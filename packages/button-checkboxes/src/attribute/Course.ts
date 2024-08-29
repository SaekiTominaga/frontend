type CourseValue = 'check' | 'uncheck';

/**
 * `data-course` value
 */
export default class {
	readonly #value: CourseValue;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | undefined) {
		if (value === undefined) {
			throw new TypeError('The `data-course` attribute is not set.');
		}

		if (!['check', 'uncheck'].includes(value)) {
			throw new TypeError('The value of the `data-course` attribute must be "check" or "uncheck".');
		}

		this.#value = value as CourseValue;
	}

	get value(): CourseValue {
		return this.#value;
	}
}
