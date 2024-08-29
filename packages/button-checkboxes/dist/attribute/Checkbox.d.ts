/**
 * `data-control` or `data-controls-class` or `data-controls-name` attribute
 */
export default class {
    #private;
    /**
     * @param value - Attribute value
     * @param value.id - `data-control`
     * @param value.class - `data-controls-class`
     * @param value.name - `data-controls-name`
     */
    constructor(value: {
        id?: string | undefined;
        class?: string | undefined;
        name?: string | undefined;
    });
    get elements(): HTMLInputElement[];
}
//# sourceMappingURL=Checkbox.d.ts.map