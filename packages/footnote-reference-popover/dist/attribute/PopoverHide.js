/**
 * `data-popover-hide-text`, `data-popover-hide-image-src`, `data-popover-hide-image-width` and `data-popover-hide-image-height` attribute
 */
export default class {
    #text;
    #imageSrc;
    #imageWidth;
    #imageHeight;
    /**
     * @param value - Attribute value
     * @param value.text - `data-popover-hide-text`
     * @param value.imageSrc - `data-popover-hide-image-src`
     * @param value.imageWidth - `data-popover-hide-image-width`
     * @param value.imageHeight - `data-popover-hide-image-height`
     */
    constructor(value) {
        if (value.text !== null && value.text !== undefined) {
            this.#text = value.text;
        }
        if (value.imageSrc !== null && value.imageSrc !== undefined) {
            this.#imageSrc = value.imageSrc;
        }
        if (value.imageWidth !== null && value.imageWidth !== undefined) {
            const width = Number(value.imageWidth);
            if (!Number.isFinite(width)) {
                throw new TypeError('The value of the `data-popover-hide-image-width` attribute must be a number.');
            }
            if (width <= 0) {
                throw new TypeError('The value of the `data-popover-hide-image-width` attribute must be a number greater than zero.');
            }
            this.#imageWidth = width;
        }
        if (value.imageHeight !== null && value.imageHeight !== undefined) {
            const height = Number(value.imageHeight);
            if (!Number.isFinite(height)) {
                throw new TypeError('The value of the `data-popover-hide-image-height` attribute must be a number.');
            }
            if (height <= 0) {
                throw new TypeError('The value of the `data-popover-hide-image-height` attribute must be a number greater than zero.');
            }
            this.#imageHeight = height;
        }
    }
    get text() {
        return this.#text;
    }
    get imageSrc() {
        return this.#imageSrc;
    }
    get imageWidth() {
        return this.#imageWidth;
    }
    get imageHeight() {
        return this.#imageHeight;
    }
}
//# sourceMappingURL=PopoverHide.js.map