export default class {
    #writingMode;
    /**
     * @param element - Target element
     */
    constructor(element) {
        const { writingMode } = getComputedStyle(element);
        switch (writingMode) {
            case 'horizontal-tb':
            case 'vertical-rl':
            case 'vertical-lr':
            case 'sideways-rl':
            case 'sideways-lr': {
                this.#writingMode = writingMode;
                break;
            }
            default:
                throw new Error(`Unexpected \`writing-mode\` value: ${writingMode}`);
        }
    }
    /**
     * Get the value of `writing-mode`
     *
     * @returns The value of `writing-mode`
     */
    get value() {
        return this.#writingMode;
    }
    /**
     * Whether the element is horizontal or not
     *
     * @returns true if horizontal
     */
    isHorizontal() {
        switch (this.#writingMode) {
            case 'horizontal-tb': {
                return true;
            }
            default:
        }
        return false;
    }
    /**
     * Whether the element is vertical or not
     *
     * @returns true if vertical
     */
    isVertical() {
        switch (this.#writingMode) {
            case 'vertical-rl':
            case 'vertical-lr':
            case 'sideways-rl':
            case 'sideways-lr': {
                return true;
            }
            default:
        }
        return false;
    }
}
//# sourceMappingURL=WritingMode.js.map