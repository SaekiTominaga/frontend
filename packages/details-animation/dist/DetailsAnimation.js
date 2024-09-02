import Duration from './attribute/Duration.js';
import Easing from './attribute/Easing.js';
import PreOpen from './attribute/PreOpen.js';
import CustomElementDetailsContent, {} from './CustomElementDetailsContent.js';
customElements.define('x-details-content', CustomElementDetailsContent);
/**
 * Animating the `<details>` element
 */
export default class {
    #detailsElement; // `<details>` 要素
    #preOpenAttribute; // `data-pre-open` 属性
    #detailsContentElement; // `<details>` 要素内の `<summary>` 要素を除くコンテンツを囲う要素
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        this.#detailsElement = thisElement;
        const { open } = thisElement;
        const { duration: durationAttribute, easing: easingAttribute } = thisElement.dataset;
        const duration = new Duration(durationAttribute ?? '500');
        const easing = new Easing(easingAttribute ?? 'ease');
        const summaryElement = thisElement.querySelector('summary');
        if (summaryElement === null) {
            throw new Error('Element `<details>` is missing a required instance of child element `<summary>`.');
        }
        this.#preOpenAttribute = new PreOpen(thisElement);
        this.#preOpenAttribute.state = open;
        /* <summary> を除くノードをラップする */
        const fragment = document.createDocumentFragment();
        let nextNode = summaryElement.nextSibling;
        while (nextNode !== null) {
            fragment.appendChild(nextNode);
            nextNode = summaryElement.nextSibling;
        }
        const detailsContentElement = document.createElement('x-details-content');
        detailsContentElement.duration = duration;
        detailsContentElement.easing = easing;
        detailsContentElement.appendChild(fragment);
        summaryElement.insertAdjacentElement('afterend', detailsContentElement);
        this.#detailsContentElement = detailsContentElement;
        thisElement.addEventListener('toggle', this.#detailsToggleEvent, { passive: true });
        summaryElement.addEventListener('click', this.#summaryClickEvent);
        detailsContentElement.addEventListener('animation-finish', this.#detailsContentAnimationFinishEvent, {
            passive: true,
        });
    }
    /**
     * `<details>` 要素の開閉状態が変化した時の処理
     */
    #detailsToggleEvent = () => {
        const { open } = this.#detailsElement;
        if (this.#preOpenAttribute.state !== open) {
            /* `<summary>` 要素のクリックを経ずに開閉状態が変化した場合（ブラウザのページ内検索など） */
            this.#preOpenAttribute.state = open;
        }
    };
    /**
     * `<summary>` 要素をクリックしたときの処理
     *
     * @param ev - Event
     */
    #summaryClickEvent = (ev) => {
        ev.preventDefault();
        this.#preOpenAttribute.toggle();
        if (this.#preOpenAttribute.state) {
            this.#detailsElement.open = true;
            this.#detailsContentElement.open();
        }
        else {
            this.#detailsContentElement.close();
        }
    };
    /**
     * 開閉アニメーションが終了したときの処理
     *
     * @param ev - Event
     */
    #detailsContentAnimationFinishEvent = (ev) => {
        const detail = ev.detail;
        switch (detail.orientation) {
            case 'close': {
                this.#detailsElement.open = false;
                break;
            }
            default:
        }
    };
}
//# sourceMappingURL=DetailsAnimation.js.map