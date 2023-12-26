/**
 * HTMLElement text
 */
export default class {
    #thisElement; // 対象要素
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        this.#thisElement = thisElement;
    }
    /**
     * Get the text width (the width of that inline box)
     *
     * @param text - Text to calculate width (If not specified, HTMLElement.textContent)
     *
     * @returns Text width in CSS pixels
     */
    getWidth(text = this.#thisElement.textContent) {
        if (text === null || text.length === 0) {
            return 0;
        }
        const context = document.createElement('canvas').getContext('2d');
        if (context === null) {
            throw new Error('Failed to get a drawing context on the canvas.');
        }
        context.beginPath();
        const styleDeclaration = getComputedStyle(this.#thisElement, '');
        context.font = `${styleDeclaration.fontStyle} ${styleDeclaration.fontVariant} ${styleDeclaration.fontWeight} ${styleDeclaration.fontSize} ${styleDeclaration.fontFamily}`;
        return context.measureText(text).width;
    }
}
//# sourceMappingURL=HtmlElementText.js.map