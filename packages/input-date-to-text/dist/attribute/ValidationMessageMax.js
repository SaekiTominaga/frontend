/**
 * `data-validation-noexist` attribute
 */
export default class {
    #value;
    /**
     * @param value - Attribute value
     * @param element - `<input>`
     */
    constructor(value, element) {
        if (element.max !== '') {
            if (value === null || value === undefined) {
                throw new TypeError('The `data-validation-max` attribute is not set.');
            }
            this.#value = value;
        }
    }
    get value() {
        return this.#value;
    }
}
//# sourceMappingURL=ValidationMessageMax.js.map