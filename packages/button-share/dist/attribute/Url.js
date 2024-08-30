/**
 * `data-url` attribute
 */
export default class {
    #url;
    /**
     * @param value - Attribute value
     */
    constructor(value) {
        if (value === undefined) {
            return;
        }
        try {
            this.#url = new URL(value);
        }
        catch (e) {
            throw new TypeError('The value of the `data-url` attribute must be a URL.');
        }
    }
    get url() {
        return this.#url;
    }
}
//# sourceMappingURL=Url.js.map