/**
 * `data-popover-class` attribute
 */
export default class {
    #name;
    /**
     * @param value - Attribute value
     */
    constructor(value) {
        if (value === null || value === undefined) {
            return;
        }
        this.#name = value;
    }
    get name() {
        return this.#name;
    }
}
//# sourceMappingURL=PopoverClass.js.map