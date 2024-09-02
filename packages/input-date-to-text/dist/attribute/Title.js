/**
 * `data-title` attribute
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
        this.#value = value;
    }
    get value() {
        return this.#value;
    }
}
//# sourceMappingURL=Title.js.map