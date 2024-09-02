/**
 * `data-feedback` attribute
 */
export default class {
    #element;
    /**
     * @param value - Attribute value
     */
    constructor(value) {
        if (value === null || value === undefined) {
            return;
        }
        const feedbackElement = document.getElementById(value);
        if (feedbackElement === null) {
            throw new Error(`Element \`#${value}\` not found.`);
        }
        this.#element = feedbackElement;
    }
    get element() {
        return this.#element;
    }
}
//# sourceMappingURL=Feedback.js.map