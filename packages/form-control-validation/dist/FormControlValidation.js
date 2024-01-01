/**
 * Input validation of form control
 */
export default class {
    #thisElement; // 対象要素
    #formControlElements = new Set(); // フォームコントロール要素
    #messageElement; // バリデーションメッセージを表示する要素
    #patternMessage; // pattern 属性値にマッチしない場合のエラー文言
    #changeEventListener;
    #invalidEventListener;
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        this.#thisElement = thisElement;
        this.#changeEventListener = this.#changeEvent.bind(this);
        this.#invalidEventListener = this.#invalidEvent.bind(this);
    }
    /**
     * Initial processing
     */
    init() {
        const messageElementId = this.#thisElement.getAttribute('aria-errormessage');
        if (messageElementId === null) {
            throw new Error('Attribute: `aria-errormessage` is not set.');
        }
        const messageElement = document.getElementById(messageElementId);
        if (messageElement === null) {
            throw new Error(`Element: #${messageElementId} can not found.`);
        }
        messageElement.setAttribute('role', 'alert');
        this.#messageElement = messageElement;
        if (['input', 'select', 'textarea'].includes(this.#thisElement.tagName.toLowerCase())) {
            this.#formControlElements.add(this.#thisElement);
        }
        else if (this.#thisElement.getAttribute('role') === 'radiogroup') {
            for (const inputRadioElement of this.#thisElement.querySelectorAll('input[type="radio"]')) {
                this.#formControlElements.add(inputRadioElement);
            }
        }
        else {
            throw new Error('The `FormControlValidation` feature can only be specified for <input>, <textarea> or <XXX role="radiogroup">.');
        }
        this.#patternMessage = this.#thisElement.dataset['validationMessagePattern'];
        for (const formControlElement of this.#formControlElements) {
            formControlElement.addEventListener('change', this.#changeEventListener, { passive: true });
            formControlElement.addEventListener('invalid', this.#invalidEventListener);
        }
    }
    /**
     * フォームコントロールの内容が変更されたときの処理
     */
    #changeEvent() {
        /* バリデーション文言をいったんクリア */
        this.#clearMessage();
        for (const formControlElement of this.#formControlElements) {
            if (!formControlElement.validity.valid) {
                /* バリデーション文言を設定 */
                formControlElement.dispatchEvent(new UIEvent('invalid'));
            }
        }
    }
    /**
     * Invalid 発生時の処理
     *
     * @param ev - Event
     */
    #invalidEvent(ev) {
        const targetElement = ev.currentTarget;
        /* バリデーション文言を設定する */
        let message = targetElement.validationMessage; // ブラウザのデフォルトメッセージ
        const { validity } = targetElement;
        if (!validity.valueMissing) {
            if (validity.patternMismatch && this.#patternMessage !== undefined) {
                /* data-* 属性でカスタムエラー文言が設定されている場合 */
                message = this.#patternMessage;
            }
        }
        this.#setMessage(message);
        ev.preventDefault();
    }
    /**
     * カスタムバリデーション文言を設定
     *
     * @param message - カスタムバリデーション文言
     */
    #setMessage(message) {
        this.#thisElement.setAttribute('aria-invalid', 'true');
        for (const formControlElement of this.#formControlElements) {
            formControlElement.setCustomValidity(message);
        }
        this.#messageElement.hidden = false;
        this.#messageElement.textContent = message;
    }
    /**
     * カスタムバリデーション文言を削除
     */
    #clearMessage() {
        this.#thisElement.setAttribute('aria-invalid', 'false');
        for (const formControlElement of this.#formControlElements) {
            formControlElement.setCustomValidity('');
        }
        this.#messageElement.hidden = true;
        this.#messageElement.textContent = '';
    }
}
//# sourceMappingURL=FormControlValidation.js.map