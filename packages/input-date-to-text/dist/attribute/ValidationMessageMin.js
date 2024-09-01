/**
 * `data-validation-min` attribute
 */
export default class {
    #value;
    /**
     * @param value - Attribute value
     * @param element - `<input>`
     */
    constructor(value, element) {
        if (element.min !== '') {
            if (value === null || value === undefined) {
                throw new TypeError('The `data-validation-min` attribute is not set.');
            }
            this.#value = value;
        }
    }
    get value() {
        return this.#value;
    }
}
//# sourceMappingURL=ValidationMessageMin.js.map