/**
 * Cover the entire screen with an overlay when form submitting
 */
export default class {
    #overlayElement; // ロード中メッセージを表示する要素
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        const { overlayedBy } = thisElement.dataset;
        const overlayElementId = overlayedBy;
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
        thisElement.addEventListener('submit', this.#submitEvent.bind(this), { passive: true });
        window.addEventListener('unload', this.#windowUnloadEvent.bind(this), { passive: true });
    }
    /**
     * フォームが送信されたときの処理
     */
    #submitEvent() {
        this.#overlayElement.showModal();
    }
    /**
     * window - unload の処理
     */
    #windowUnloadEvent() {
        this.#overlayElement.close();
    }
}
//# sourceMappingURL=FormSubmitOverlay.js.map