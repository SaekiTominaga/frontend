/**
 * Prevent page unloaded while filling out a form
 */
export default class {
    #submitForm = false; // フォームが送信されたか
    #changeControl = false; // フォームコントロールが変更されたか
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        for (const formControlElement of thisElement.elements) {
            formControlElement.addEventListener('change', this.#formControlChangeEvent.bind(this), { once: true, passive: true });
        }
        thisElement.addEventListener('submit', this.#submitEvent.bind(this), { once: true, passive: true });
        window.addEventListener('beforeunload', this.#windowBeforeUnloadEvent.bind(this));
    }
    /**
     * フォームコントロールの内容が変更されたときの処理
     */
    #formControlChangeEvent() {
        this.#changeControl = true;
    }
    /**
     * フォームが送信されたときの処理
     */
    #submitEvent() {
        this.#submitForm = true;
    }
    /**
     * window - beforeunload の処理
     *
     * @param ev - Event
     */
    #windowBeforeUnloadEvent(ev) {
        if (!this.#submitForm && this.#changeControl) {
            ev.preventDefault();
            ev.returnValue = ''; // for Chrome https://bugs.chromium.org/p/chromium/issues/detail?id=866818
        }
    }
}
//# sourceMappingURL=FormBeforeUnloadConfirm.js.map