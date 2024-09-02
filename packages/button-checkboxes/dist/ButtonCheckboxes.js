import Checkbox from './attribute/Checkbox.js';
import Course from './attribute/Course.js';
/**
 * Button to check / uncheck checkboxes group
 */
export default class {
    #checkbox; // 制御対象のチェックボックス
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        const { course: courseAttribute, control: controlAttribute, controlsClass: controlsClassAttribute, controlsName: controlsNameAttribute, } = thisElement.dataset;
        const course = new Course(courseAttribute);
        this.#checkbox = new Checkbox({ id: controlAttribute, class: controlsClassAttribute, name: controlsNameAttribute });
        /* `aria-controls` の設定 */
        if (thisElement.getAttribute('aria-controls') === null) {
            const checkboxIds = [];
            this.#checkbox.elements.forEach((checkbox) => {
                if (checkbox.id === '') {
                    checkbox.id = crypto.randomUUID(); // チェックボックスの ID が指定されていない場合はランダム生成
                }
                checkboxIds.push(checkbox.id);
            });
            thisElement.setAttribute('aria-controls', checkboxIds.join(' '));
        }
        switch (course.value) {
            case 'check': {
                /* 全選択ボタン */
                thisElement.addEventListener('click', this.#clickCheckEvent, { passive: true });
                break;
            }
            case 'uncheck': {
                /* 全解除ボタン */
                thisElement.addEventListener('click', this.#clickUncheckEvent, { passive: true });
                break;
            }
            default:
        }
    }
    /**
     * 全選択ボタン押下時の処理
     */
    #clickCheckEvent = () => {
        this.#checkbox.elements
            .filter((element) => !element.checked)
            .forEach((element) => {
            element.checked = true;
        });
    };
    /**
     * 全解除ボタン押下時の処理
     */
    #clickUncheckEvent = () => {
        this.#checkbox.elements
            .filter((element) => element.checked)
            .forEach((element) => {
            element.checked = false;
        });
    };
}
//# sourceMappingURL=ButtonCheckboxes.js.map