/**
 * `data-message` attribute
 */
export default class {
    #text;
    /**
     * @param value - Attribute value
     */
    constructor(value) {
        if (value === null || value === undefined) {
            throw new TypeError('The `data-message` attribute is not set.');
        }
        this.#text = value;
    }
    get text() {
        return this.#text;
    }
}
//# sourceMappingURL=Message.js.map