/**
 * `data-validation-noexist`, `data-validation-min` and `data-validation-max` attribute
 */
export default class {
    #noexist;
    #min;
    #max;
    /**
     * @param value - Attribute value
     * @param value.noexist - `data-validation-noexist`
     * @param value.min - `data-validation-min`
     * @param value.max - `data-validation-max`
     * @param element - `<input>`
     */
    constructor(value, element) {
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
    get noexist() {
        return this.#noexist;
    }
    get min() {
        return this.#min;
    }
    get max() {
        return this.#max;
    }
}
//# sourceMappingURL=ValidationMessage.js.map