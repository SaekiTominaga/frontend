/**
 * Prevent page unloaded while filling out a form
 */
export default class {
    #thisElement; // 対象要素
    #submitForm = false; // フォームが送信されたか
    #changeControl = false; // フォームコントロールが変更されたか
    #formControlChangeEventListener;
    #submitEventListener;
    #windowBeforeUnloadEventListener;
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        this.#thisElement = thisElement;
        this.#formControlChangeEventListener = this.#formControlChangeEvent.bind(this);
        this.#submitEventListener = this.#submitEvent.bind(this);
        this.#windowBeforeUnloadEventListener = this.#windowBeforeUnloadEvent.bind(this);
    }
    /**
     * Initial processing
     */
    init() {
        for (const formControlElement of this.#thisElement.elements) {
            formControlElement.addEventListener('change', this.#formControlChangeEventListener, { once: true, passive: true });
        }
        this.#thisElement.addEventListener('submit', this.#submitEventListener, { once: true, passive: true });
        window.addEventListener('beforeunload', this.#windowBeforeUnloadEventListener);
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