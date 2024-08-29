/**
 * `data-text` or `data-target` attribute
 */
export default class {
    #text;
    #target;
    /**
     * @param value - Attribute value
     * @param value.text - `data-text`
     * @param value.target - `data-target`
     */
    constructor(value) {
        if (value.text === undefined && value.target === undefined) {
            throw new TypeError('The `data-text` or `data-target` attribute is not set.');
        }
        if (value.text !== undefined) {
            this.#text = value.text;
        }
        if (value.target !== undefined) {
            const targetElement = document.getElementById(value.target);
            if (targetElement === null) {
                throw new Error(`Element \`#${value.target}\` not found.`);
            }
            this.#target = targetElement;
        }
    }
    get text() {
        return this.#text;
    }
    get element() {
        return this.#target;
    }
}
//# sourceMappingURL=Data.js.map