import Duration from './attribute/Duration.js';
import Easing from './attribute/Easing.js';
import CustomElementDetailsContent, {} from './CustomElementDetailsContent.js';
customElements.define('x-details-content', CustomElementDetailsContent);
/**
 * Animating the `<details>` element
 */
export default class {
    #detailsElement; // `<details>` 要素
    #detailsContentElement; // `<details>` 要素内の `<summary>` 要素を除くコンテンツを囲う要素
    #detailsToggleEventListener;
    #summaryClickEventListener;
    #detailsContentAnimationFinishEventListener;
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        thisElement.dataset['preOpen'] = String(thisElement.open);
        this.#detailsElement = thisElement;
        const { duration: durationAttribute, easing: easingAttribute } = thisElement.dataset;
        const summaryElement = thisElement.querySelector('summary');
        if (summaryElement === null) {
            throw new Error('Element `<details>` is missing a required instance of child element `<summary>`.');
        }
        /* <summary> を除くノードをラップする */
        const fragment = document.createDocumentFragment();
        let nextNode = summaryElement.nextSibling;
        while (nextNode !== null) {
            fragment.appendChild(nextNode);
            nextNode = summaryElement.nextSibling;
        }
        const detailsContentElement = document.createElement('x-details-content');
        try {
            detailsContentElement.duration = new Duration(durationAttribute ?? '500');
        }
        catch (e) {
            console.error(e.message);
        }
        try {
            detailsContentElement.easing = new Easing(easingAttribute ?? 'ease');
        }
        catch (e) {
            console.error(e.message);
        }
        detailsContentElement.appendChild(fragment);
        summaryElement.insertAdjacentElement('afterend', detailsContentElement);
        this.#detailsContentElement = detailsContentElement;
        this.#detailsToggleEventListener = this.#detailsToggleEvent.bind(this);
        this.#summaryClickEventListener = this.#summaryClickEvent.bind(this);
        this.#detailsContentAnimationFinishEventListener = this.#detailsContentAnimationFinishEvent.bind(this);
        thisElement.addEventListener('toggle', this.#detailsToggleEventListener, { passive: true });
        summaryElement.addEventListener('click', this.#summaryClickEventListener);
        detailsContentElement.addEventListener('animation-finish', this.#detailsContentAnimationFinishEventListener, {
            passive: true,
        });
    }
    /**
     * `<details>` 要素の開閉状態が変化した時の処理
     */
    #detailsToggleEvent() {
        const open = String(this.#detailsElement.open);
        if (this.#detailsElement.dataset['preOpen'] !== open) {
            /* `<summary>` 要素のクリックを経ずに開閉状態が変化した場合（ブラウザのページ内検索など） */
            this.#detailsElement.dataset['preOpen'] = open;
        }
    }
    /**
     * `<summary>` 要素をクリックしたときの処理
     *
     * @param ev - Event
     */
    #summaryClickEvent(ev) {
        ev.preventDefault();
        const preOpen = this.#detailsElement.dataset['preOpen'] !== 'true';
        this.#detailsElement.dataset['preOpen'] = String(preOpen);
        if (preOpen) {
            this.#detailsElement.open = true;
            this.#detailsContentElement.open();
        }
        else {
            this.#detailsContentElement.close();
        }
    }
    /**
     * 開閉アニメーションが終了したときの処理
     *
     * @param ev - Event
     */
    #detailsContentAnimationFinishEvent(ev) {
        const detail = ev.detail;
        switch (detail.orientation) {
            case 'close': {
                this.#detailsElement.open = false;
                break;
            }
            default:
        }
    }
}
//# sourceMappingURL=DetailsAnimation.js.map