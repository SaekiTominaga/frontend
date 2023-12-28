import IsbnVerify from '@saekitominaga/isbn-verify';
/**
 * ISBN input field
 */
export default class InputIsbn extends HTMLInputElement {
    #checkDigitMessage; // チェックデジットが不正なときのメッセージ
    #formSubmitEventListener;
    constructor() {
        super();
        this.#formSubmitEventListener = this.#formSubmitEvent.bind(this);
    }
    connectedCallback() {
        const { validationMessageIsbnCheckdigit: isbnCheckDigitMessage } = this.dataset;
        if (isbnCheckDigitMessage === undefined) {
            throw new Error('Attribute: `data-validation-message-isbn-checkdigit` is not set.');
        }
        this.#checkDigitMessage = isbnCheckDigitMessage;
        this.type = 'text';
        this.minLength = 10;
        this.maxLength = 17;
        this.pattern = '(978|979)-\\d{1,5}-\\d{1,7}-\\d{1,7}-\\d|\\d{13}|\\d{1,5}-\\d{1,7}-\\d{1,7}-[\\dX]|\\d{9}[\\dX]';
        this.addEventListener('change', this.#changeEvent, { passive: true });
        this.form?.addEventListener('submit', this.#formSubmitEventListener);
    }
    disconnectedCallback() {
        this.removeEventListener('change', this.#changeEvent);
        this.form?.removeEventListener('submit', this.#formSubmitEventListener);
    }
    /**
     * フォームコントロールの内容が変更されたときの処理
     */
    #changeEvent = () => {
        if (this.validity.patternMismatch) {
            /* ブラウザ標準機能によるチェックを優先する */
            return;
        }
        this.#validate();
    };
    /**
     * フォーム送信時の処理
     *
     * @param ev - Event
     */
    #formSubmitEvent(ev) {
        if (!this.#validate()) {
            ev.preventDefault();
        }
    }
    /**
     * バリデーションを実行
     *
     * @returns バリデーションが通れば true
     */
    #validate() {
        if (this.value === '') {
            return true;
        }
        if (!new IsbnVerify(this.value).isValid()) {
            this.#setMessage(this.#checkDigitMessage);
            return false;
        }
        this.#clearMessage();
        return true;
    }
    /**
     * カスタムバリデーション文言を設定
     *
     * @param message - カスタムバリデーション文言
     */
    #setMessage(message) {
        this.setCustomValidity(message);
        this.dispatchEvent(new Event('invalid'));
    }
    /**
     * カスタムバリデーション文言を削除
     */
    #clearMessage() {
        this.setCustomValidity('');
    }
}
//# sourceMappingURL=InputIsbn.js.map