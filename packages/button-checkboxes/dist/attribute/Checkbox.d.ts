/**
 * `data-control` or `data-controls-class` or `data-controls-name` value
 */
export default class {
    #private;
    /**
     * @param value - Attribute value
     * @param value.id -
     * @param value.class -
     * @param value.name -
     */
    constructor(value: {
        id?: string | undefined;
        class?: string | undefined;
        name?: string | undefined;
    });
    get elements(): HTMLInputElement[];
}
//# sourceMappingURL=Checkbox.d.ts.map