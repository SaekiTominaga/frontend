import crypto from 'crypto';
/**
 * Button to check / uncheck checkboxes group
 */
export default class {
    #course; // ボタンの機能（全選択 or 全解除）
    #checkboxElements = []; // 制御対象のチェックボックス
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        const { course, control, controlsClass, controlsName } = thisElement.dataset;
        switch (course) {
            case 'check':
            case 'uncheck':
                this.#course = course;
                break;
            case undefined:
                throw new Error('Attribute: `data-course` is not set.');
            default:
                throw new Error("Only 'check' or 'uncheck' can be set for the `data-course` attribute.");
        }
        if (control === undefined && controlsClass === undefined && controlsName === undefined) {
            throw new Error('Attribute: `data-control` or `data-controls-class` or `data-controls-name` is not set.');
        }
        if (control !== undefined) {
            const checkboxGroupElement = document.getElementById(control);
            if (checkboxGroupElement === null) {
                throw new Error(`Element: #${control} can not found.`);
            }
            const checkboxElements = checkboxGroupElement.querySelectorAll('input[type="checkbox"]');
            if (checkboxElements.length === 0) {
                throw new Error(`Checkbox does not exist in descendants of the Element: #${control}.`);
            }
            this.#checkboxElements = this.#checkboxElements.concat(Array.from(checkboxElements));
        }
        if (controlsClass !== undefined) {
            const checkboxElements = document.getElementsByClassName(controlsClass);
            if (checkboxElements.length === 0) {
                throw new Error(`Element: .${controlsClass} can not found.`);
            }
            this.#checkboxElements = this.#checkboxElements.concat(Array.from(checkboxElements));
        }
        if (controlsName !== undefined) {
            const checkboxElements = document.getElementsByName(controlsName);
            if (checkboxElements.length === 0) {
                throw new Error(`Element: [name=${controlsName}] can not found.`);
            }
            this.#checkboxElements = this.#checkboxElements.concat(Array.from(checkboxElements));
        }
        /* `aria-controls` の設定 */
        if (thisElement.getAttribute('aria-controls') === null) {
            const checkboxIds = [];
            this.#checkboxElements.forEach((element) => {
                if (element.id === '') {
                    element.id = crypto.randomUUID(); // チェックボックスの ID が指定されていない場合はランダム生成
                }
                checkboxIds.push(element.id);
            });
            thisElement.setAttribute('aria-controls', checkboxIds.join(' '));
        }
        thisElement.addEventListener('click', this.#clickEvent, { passive: true });
    }
    /**
     * ボタン押下時の処理
     */
    #clickEvent = () => {
        switch (this.#course) {
            case 'check': {
                /* チェックボックスをすべてチェックする */
                for (const checkboxUncheckedElement of this.#checkboxElements.filter((element) => !element.checked)) {
                    checkboxUncheckedElement.checked = true;
                }
                break;
            }
            case 'uncheck': {
                /* チェックボックスをすべて解除する */
                for (const checkboxCheckedElement of this.#checkboxElements.filter((element) => element.checked)) {
                    checkboxCheckedElement.checked = false;
                }
                break;
            }
            default:
        }
    };
}
//# sourceMappingURL=ButtonCheckboxes.js.map