/**
 * `data-course` value
 */
export default class {
    #value;
    /**
     * @param value - Attribute value
     */
    constructor(value) {
        if (value === undefined) {
            throw new TypeError('The `data-course` attribute is not set.');
        }
        if (!['check', 'uncheck'].includes(value)) {
            throw new TypeError('The value of the `data-course` attribute must be "check" or "uncheck".');
        }
        this.#value = value;
    }
    get value() {
        return this.#value;
    }
}
//# sourceMappingURL=Course.js.map