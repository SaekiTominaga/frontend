/**
 * `data-max-size` attribute
 */
export default class {
    #value;
    /**
     * @param value - Attribute value
     */
    constructor(value) {
        if (value === null || value === undefined) {
            return;
        }
        const valueNumber = Number(value);
        if (!Number.isFinite(valueNumber)) {
            throw new TypeError('The value of the `data-max-size` attribute must be a number.');
        }
        if (valueNumber < 0) {
            throw new TypeError('The value of the `data-max-size` attribute must be a positive number.');
        }
        this.#value = valueNumber;
    }
    get value() {
        return this.#value;
    }
}
//# sourceMappingURL=MaxSize.js.map