export default class {
    #element;
    constructor(element) {
        this.#element = element;
    }
    /**
     * Get the contents of an HTMLElement (e.g. `Node.textContent`)
     *
     * @returns Contents
     */
    getContent() {
        const { textContent } = this.#element;
        if (textContent === null) {
            throw new Error('Node is not an HTMLElement.'); // ノードが HTMLElement である場合、`Node.textContent` の値が null になることはない（空要素は空文字列を返す）
        }
        switch (this.#element.tagName.toLowerCase()) {
            case 'data':
            case 'input':
            case 'select':
            case 'textarea':
            case 'output':
                return this.#element.value;
            case 'meta':
                return this.#element.content;
            case 'pre':
                return textContent;
            default:
        }
        return textContent.trim();
    }
}
//# sourceMappingURL=HTMLElementUtil.js.map