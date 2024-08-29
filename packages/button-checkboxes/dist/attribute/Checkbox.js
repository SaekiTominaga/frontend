/**
 * `data-control` or `data-controls-class` or `data-controls-name` attribute
 */
export default class {
    #elements = [];
    /**
     * @param value - Attribute value
     * @param value.id - `data-control`
     * @param value.class - `data-controls-class`
     * @param value.name - `data-controls-name`
     */
    constructor(value) {
        if (value.id === undefined && value.class === undefined && value.name === undefined) {
            throw new TypeError('The `data-control` or `data-controls-class` or `data-controls-name` attribute is not set.');
        }
        if (value.id !== undefined) {
            const checkboxGroupElement = document.getElementById(value.id);
            if (checkboxGroupElement === null) {
                throw new Error(`Element \`#${value.id}\` not found.`);
            }
            const checkboxElements = checkboxGroupElement.querySelectorAll('input[type="checkbox"]');
            if (checkboxElements.length === 0) {
                throw new Error(`Checkbox does not exist in descendants of the element \`#${value.id}\`.`);
            }
            this.#elements = this.#elements.concat([...checkboxElements]);
        }
        if (value.class !== undefined) {
            const checkboxElements = document.getElementsByClassName(value.class);
            if (checkboxElements.length === 0) {
                throw new Error(`Element \`.${value.class}\` not found.`);
            }
            this.#elements = this.#elements.concat([...checkboxElements]);
        }
        if (value.name !== undefined) {
            const checkboxElements = document.getElementsByName(value.name);
            if (checkboxElements.length === 0) {
                throw new Error(`Element \`[name=${value.name}]\` not found.`);
            }
            this.#elements = this.#elements.concat([...checkboxElements]);
        }
    }
    get elements() {
        return this.#elements;
    }
}
//# sourceMappingURL=Checkbox.js.map