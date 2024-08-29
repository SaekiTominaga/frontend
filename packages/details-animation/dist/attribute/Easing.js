/**
 * `data-easing` attribute
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
        if (!['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier', 'step-start', 'step-end', 'steps'].includes(value)) {
            throw new TypeError('The value of the `data-easing` attribute must be "linear", "ease", "ease-in", "ease-out", "ease-in-out", "cubic-bezier", "step-start", "step-end", or "steps".');
        }
        this.#value = value;
    }
    get value() {
        return this.#value;
    }
}
//# sourceMappingURL=Easing.js.map