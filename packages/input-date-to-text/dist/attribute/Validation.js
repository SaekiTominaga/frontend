/**
 * `data-validation-noexist`, `data-validation-min` and `data-validation-max` attribute
 */
export default class {
    #min;
    #min;
    #max;
    /**
     * @param element -
     * @param value - Attribute value
     * @param value.noexist - `data-validation-noexist`
     * @param value.min - `data-validation-min`
     * @param value.max - `data-validation-max`
     */
    constructor(element, value) {
        if ((value.noexist === null || value.noexist === undefined)) {
            throw new Error('The `data-validation-noexist` attribute is not set.');
        }
        this.#min = value.noexist;
        /* 日付コントロールを <input type="text"> に置換 */
        if (thisElement.min !== '') {
            if (validationMin === undefined) {
                throw new Error('Attribute: `data-validation-min` is not set.');
            }
            this.#min = thisElement.min;
            this.#minMessage = validationMin;
            thisElement.removeAttribute('min');
        }
        if (thisElement.max !== '') {
            if (validationMax === undefined) {
                throw new Error('Attribute: `data-validation-max` is not set.');
            }
            this.#max = thisElement.max;
            this.#maxMessage = validationMax;
            thisElement.removeAttribute('max');
        }
        if (thisElement.step !== '') {
            thisElement.removeAttribute('step'); // TODO: `step` 属性指定時の挙動は未実装
        }
    }
    get element() {
        return this.#element;
    }
}
//# sourceMappingURL=Validation.js.map