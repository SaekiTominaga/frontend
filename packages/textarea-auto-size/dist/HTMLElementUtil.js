export default class {
    #element;
    constructor(element) {
        this.#element = element;
    }
    /**
     * Gets the `writing-mode` state of the element
     *
     * @returns `horizontal` or `vertical`
     */
    getWritingMode() {
        const { writingMode } = getComputedStyle(this.#element, '');
        switch (writingMode) {
            case 'vertical-rl':
            case 'vertical-lr':
            case 'sideways-rl':
            case 'sideways-lr': {
                return 'vertical';
            }
            default:
        }
        return 'horizontal';
    }
}
//# sourceMappingURL=HTMLElementUtil.js.map