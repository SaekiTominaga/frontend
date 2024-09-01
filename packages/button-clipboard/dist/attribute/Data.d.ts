/**
 * `data-text` or `data-target` attribute
 */
export default class {
    #private;
    /**
     * @param value - Attribute value
     * @param value.text - `data-text`
     * @param value.target - `data-target`
     */
    constructor(value: {
        text: string | null | undefined;
        target: string | null | undefined;
    });
    get text(): string | undefined;
    get element(): HTMLElement | undefined;
}
//# sourceMappingURL=Data.d.ts.map