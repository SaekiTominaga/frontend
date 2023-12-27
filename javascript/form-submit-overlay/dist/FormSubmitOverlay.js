/**
 * Cover the entire screen with an overlay when form submitting
 */
export default class {
    #thisElement; // 対象要素
    #overlayElement; // ロード中メッセージを表示する要素
    #submitEventListener;
    #windowUnloadEventListener;
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        this.#thisElement = thisElement;
        this.#submitEventListener = this.#submitEvent.bind(this);
        this.#windowUnloadEventListener = this.#windowUnloadEvent.bind(this);
    }
    /**
     * Initial processing
     */
    init() {
        const overlayElementId = this.#thisElement.dataset['overlayedBy'];
        if (overlayElementId === undefined) {
            throw new Error('Attribute: `data-overlayed-by` is not set.');
        }
        const overlayElement = document.getElementById(overlayElementId);
        if (overlayElement === null) {
            throw new Error(`Element: #${overlayElementId} can not found.`);
        }
        if (!('showModal' in overlayElement)) {
            throw new Error(`Element: #${overlayElementId} must be a \`<dialog>\` element.`);
        }
        this.#overlayElement = overlayElement;
        this.#thisElement.addEventListener('submit', this.#submitEventListener, { passive: true });
        window.addEventListener('unload', this.#windowUnloadEventListener, { passive: true });
    }
    /**
     * フォームが送信されたときの処理
     */
    #submitEvent() {
        this.#overlayElement?.showModal();
    }
    /**
     * window - unload の処理
     */
    #windowUnloadEvent() {
        this.#overlayElement?.close();
    }
}
//# sourceMappingURL=FormSubmitOverlay.js.map