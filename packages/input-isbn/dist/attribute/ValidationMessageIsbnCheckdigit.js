/**
 * `data-validation-message-isbn-checkdigit` attribute
 */
export default class {
    #value;
    /**
     * @param value - Attribute value
     */
    constructor(value) {
        if (value === null || value === undefined) {
            throw new TypeError('The `data-validation-message-isbn-checkdigit` attribute is not set.');
        }
        this.#value = value;
    }
    get value() {
        return this.#value;
    }
}
//# sourceMappingURL=ValidationMessageIsbnCheckdigit.js.map