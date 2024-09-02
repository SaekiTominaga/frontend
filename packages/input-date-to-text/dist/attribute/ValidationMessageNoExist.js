/**
 * `data-validation-noexist` attribute
 */
export default class {
    #value;
    /**
     * @param value - Attribute value
     */
    constructor(value) {
        if (value === null || value === undefined) {
            throw new TypeError('The `data-validation-noexist` attribute is not set.');
        }
        this.#value = value;
    }
    get value() {
        return this.#value;
    }
}
//# sourceMappingURL=ValidationMessageNoExist.js.map