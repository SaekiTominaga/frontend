/**
 * `data-pre-open` attribute
 */
export default class {
    #element;
    /**
     * @param element - `<details>` element
     */
    constructor(element) {
        this.#element = element;
    }
    get state() {
        return this.#element.dataset['preOpen'] === 'true';
    }
    set state(open) {
        this.#element.dataset['preOpen'] = String(open);
    }
    /**
     * Toggle attribute values
     */
    toggle() {
        this.#element.dataset['preOpen'] = String(this.#element.dataset['preOpen'] !== 'true');
    }
}
//# sourceMappingURL=PreOpen.js.map