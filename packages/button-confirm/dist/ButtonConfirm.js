import Message from './attribute/Message.js';
/**
 * Display a `confirm()` modal dialog when button is pressed
 */
export default class {
    #message;
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        const { message: messageAttribute } = thisElement.dataset;
        this.#message = new Message(messageAttribute);
        thisElement.addEventListener('click', this.#clickEvent);
    }
    /**
     * ボタン押下時の処理
     *
     * @param ev - MouseEvent
     */
    #clickEvent = (ev) => {
        if (!confirm(this.#message.text)) {
            ev.preventDefault();
        }
    };
}
//# sourceMappingURL=ButtonConfirm.js.map