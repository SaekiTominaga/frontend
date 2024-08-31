import ErrorMessage from './attribute/ErrorMessage.js';
import Title from './attribute/Title.js';
/**
 * Input validation of form control
 */
export default class {
    #thisElement; // 対象要素
    #formControlElements = new Set(); // フォームコントロール要素
    #title; // title 属性
    #errorMessage; // バリデーションメッセージを表示する要素
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        this.#thisElement = thisElement;
        const titleAttribute = thisElement.getAttribute('title');
        const ariaErrormessageAttribute = thisElement.getAttribute('aria-errormessage');
        this.#title = new Title(titleAttribute);
        this.#errorMessage = new ErrorMessage(ariaErrormessageAttribute);
        if (['input', 'select', 'textarea'].includes(thisElement.tagName.toLowerCase())) {
            this.#formControlElements.add(thisElement);
        }
        else if (thisElement.getAttribute('role') === 'radiogroup') {
            for (const inputRadioElement of thisElement.querySelectorAll('input[type="radio"]')) {
                this.#formControlElements.add(inputRadioElement);
            }
        }
        else {
            throw new Error('The `FormControlValidation` feature can only be specified for `<input>`, `<select>`, `<textarea>` or `<XXX role=radiogroup>`.');
        }
        for (const formControlElement of this.#formControlElements) {
            formControlElement.addEventListener('change', this.#changeEvent.bind(this), { passive: true });
            formControlElement.addEventListener('invalid', this.#invalidEvent.bind(this));
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
            if (validity.patternMismatch && this.#title.value !== undefined) {
                /* title 属性が設定されている場合 */
                message = this.#title.value;
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
        this.#errorMessage.element.hidden = false;
        this.#errorMessage.element.textContent = message;
    }
    /**
     * カスタムバリデーション文言を削除
     */
    #clearMessage() {
        this.#thisElement.setAttribute('aria-invalid', 'false');
        for (const formControlElement of this.#formControlElements) {
            formControlElement.setCustomValidity('');
        }
        this.#errorMessage.element.hidden = true;
        this.#errorMessage.element.textContent = '';
    }
}
//# sourceMappingURL=FormControlValidation.js.map