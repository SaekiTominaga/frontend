/**
 * `aria-errormessage` attribute
 */
export default class {
    #element;
    /**
     * @param value - Attribute value
     */
    constructor(value) {
        if (value === null || value === undefined) {
            throw new TypeError('The `aria-errormessage` attribute is not set.');
        }
        const element = document.getElementById(value);
        if (element === null) {
            throw new Error(`Element \`#${value}\` not found.`);
        }
        element.setAttribute('role', 'alert');
        this.#element = element;
    }
    get element() {
        return this.#element;
    }
}
//# sourceMappingURL=ErrorMessage.js.map