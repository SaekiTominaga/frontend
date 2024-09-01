/**
 * `max` attribute
 */
export default class {
    #value;
    /**
     * @param value - Attribute value
     */
    constructor(value) {
        if (value === null || value === undefined || value === '') {
            return;
        }
        if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(value)) {
            throw new TypeError('The format of the `max` attribute must be `YYYY-MM-DD`.');
        }
        this.#value = new Date(Number(value.substring(0, 4)), Number(value.substring(5, 7)) - 1, Number(value.substring(8, 10)));
    }
    get value() {
        return this.#value;
    }
}
//# sourceMappingURL=Max.js.map