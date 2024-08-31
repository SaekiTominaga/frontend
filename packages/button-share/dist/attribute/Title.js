/**
 * `data-title` attribute
 */
export default class {
    #text;
    /**
     * @param value - Attribute value
     */
    constructor(value) {
        if (value === null || value === undefined) {
            return;
        }
        this.#text = value;
    }
    get text() {
        return this.#text;
    }
}
//# sourceMappingURL=Title.js.map