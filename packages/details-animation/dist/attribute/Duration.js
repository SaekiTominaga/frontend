/**
 * `duration` value
 */
export default class {
    #value;
    /**
     * @param value - Attribute value
     */
    constructor(value) {
        if (value === undefined) {
            return;
        }
        const valueNumber = Number(value);
        if (!Number.isFinite(valueNumber)) {
            throw new TypeError('The value of the `data-duration` attribute must be a number.');
        }
        if (valueNumber < 0) {
            throw new TypeError('The value of the `data-duration` attribute must be a positive number.');
        }
        this.#value = valueNumber;
    }
    get value() {
        return this.#value;
    }
}
//# sourceMappingURL=Duration.js.map