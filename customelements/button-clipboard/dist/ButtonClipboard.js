var _a;
/**
 * Clipboard write text button
 */
class ClipboardButton extends HTMLButtonElement {
    #writeText;
    #targetElement;
    #feedbackElement;
    constructor() {
        super();
        this.type = 'button';
    }
    connectedCallback() {
        const { text: writeText, targetFor: targetElementId, feedbackFor: feedbackElementId } = this.dataset;
        if (writeText === undefined && targetElementId === undefined) {
            throw new Error('Attribute: `data-text` or `data-target-for` is not set.');
        }
        if (writeText !== undefined) {
            this.#writeText = writeText;
        }
        if (targetElementId !== undefined) {
            const targetElement = document.getElementById(targetElementId);
            if (targetElement === null) {
                throw new Error(`Element: #${targetElementId} can not found.`);
            }
            this.#targetElement = targetElement;
        }
        if (feedbackElementId !== undefined) {
            const feedbackElement = document.getElementById(feedbackElementId);
            if (feedbackElement === null) {
                throw new Error(`Element: #${feedbackElementId} can not found.`);
            }
            this.#feedbackElement = feedbackElement;
        }
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.addEventListener('click', this.#clickEvent, { passive: true });
    }
    disconnectedCallback() {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.removeEventListener('click', this.#clickEvent);
    }
    /**
     * ボタン押下時の処理
     */
    #clickEvent = async () => {
        const writeText = this.#writeText !== undefined ? this.#writeText : _a.#getContent(this.#targetElement); // data-text と data-target-for が両方指定されている場合は前者を優先する
        await navigator.clipboard.writeText(writeText);
        if (this.#feedbackElement !== undefined) {
            this.#feedbackElement.hidden = false;
        }
        else {
            console.info('Clipboard write successfully.', writeText);
        }
    };
    /**
     * HTMLElement のコンテンツ (Node.textContent など) を取得する
     *
     * @param element - HTMLElement
     *
     * @returns Node.textContent の値 (一部要素は `value` などの属性値)
     */
    static #getContent(element) {
        if (element === undefined) {
            throw new Error('Element can not found.');
        }
        const { textContent } = element;
        if (textContent === null) {
            throw new Error('Node is not an HTMLElement.'); // ノードが HTMLElement である場合、 Node.textContent の値が null になることはない（空要素は空文字列を返す）
        }
        switch (element.tagName.toLowerCase()) {
            case 'data':
            case 'input':
            case 'select':
            case 'textarea':
            case 'output':
                return element.value;
            case 'meta':
                return element.content;
            case 'pre':
                return textContent;
            default:
        }
        return textContent.trim();
    }
}
_a = ClipboardButton;
export default ClipboardButton;
//# sourceMappingURL=ButtonClipboard.js.map