/**
 * `data-mouseenter-delay` attribute
 */
export default class {
    #delay;
    /**
     * @param value - Attribute value
     * @param value.delay - `data-mouseenter-delay`
     */
    constructor(value) {
        if (value.delay !== undefined) {
            const delay = Number(value.delay);
            if (!Number.isFinite(delay)) {
                throw new TypeError('The value of the `data-mouseenter-delay` attribute must be a number.');
            }
            if (delay <= 0) {
                throw new TypeError('The value of the `data-mouseenter-delay` attribute must be a number greater than zero.');
            }
            this.#delay = delay;
        }
    }
    get delay() {
        return this.#delay;
    }
}
//# sourceMappingURL=Mouseenter.js.map