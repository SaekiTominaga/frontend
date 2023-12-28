import HTMLElementUtil from './HTMLElementUtil.js';
/**
 * Animating the `<details>` element
 */
export default class DetailsAnimation extends HTMLDetailsElement {
    #animation = null;
    #keyframeAnimationOptions = {
        duration: 500,
        easing: 'ease',
    }; // https://developer.mozilla.org/en-US/docs/Web/API/Element/animate#parameters
    #summaryElement = null; // <summary> 要素
    #detailsContentElement; // <details> 要素内の <summary> 要素を除くコンテンツを囲う要素
    #detailsContentBlockSize = null; // コンテンツを囲う要素の高さ
    #detailsToggleEventListener;
    #summaryClickEventListener;
    constructor() {
        super();
        this.#detailsContentElement = document.createElement('div');
        this.#detailsToggleEventListener = this.#detailsToggleEvent.bind(this);
        this.#summaryClickEventListener = this.#summaryClickEvent.bind(this);
    }
    connectedCallback() {
        const summaryElement = this.querySelector('summary');
        if (summaryElement === null) {
            throw new Error('Element <details> is missing a required instance of child element <summary>.');
        }
        this.#summaryElement = summaryElement;
        this.dataset['preOpen'] = String(this.open);
        const { duration, easing } = this.dataset;
        if (duration !== undefined) {
            this.#keyframeAnimationOptions.duration = Number(duration);
        }
        if (easing !== undefined) {
            this.#keyframeAnimationOptions.easing = easing;
        }
        /* <summary> を除くノードをラップする */
        const fragment = document.createDocumentFragment();
        let nextNode = summaryElement.nextSibling;
        while (nextNode !== null) {
            fragment.appendChild(nextNode);
            nextNode = summaryElement.nextSibling;
        }
        const detailsContentElement = this.#detailsContentElement;
        detailsContentElement.style.overflow = 'hidden';
        detailsContentElement.appendChild(fragment);
        summaryElement.insertAdjacentElement('afterend', detailsContentElement);
        this.addEventListener('toggle', this.#detailsToggleEventListener);
        summaryElement.addEventListener('click', this.#summaryClickEventListener);
    }
    disconnectedCallback() {
        this.#summaryElement?.removeEventListener('click', this.#summaryClickEventListener);
    }
    /**
     * <details> 要素の開閉状態が変化した時の処理
     */
    #detailsToggleEvent() {
        const open = String(this.open);
        if (this.dataset['preOpen'] !== open) {
            /* <summary> クリックを経ずに開閉状態が変化した場合（ブラウザのページ内検索など） */
            this.dataset['preOpen'] = open;
        }
    }
    /**
     * <summary> 要素をクリックしたときの処理
     *
     * @param ev - Event
     */
    #summaryClickEvent(ev) {
        ev.preventDefault();
        const preOpen = this.dataset['preOpen'] !== 'true';
        this.dataset['preOpen'] = String(preOpen);
        if (this.#animation?.playState === 'running') {
            /* アニメーションが終わらないうちに連続して <summary> がクリックされた場合 */
            const blockSize = this.#getContentBlockSize();
            this.#detailsContentElement.style.blockSize = `${blockSize}px`;
            this.#animation.cancel();
            if (preOpen) {
                this.#open(blockSize);
            }
            else {
                this.#close();
            }
        }
        else {
            // eslint-disable-next-line no-lonely-if
            if (preOpen) {
                this.#open(0);
            }
            else {
                this.#close();
            }
        }
    }
    /**
     * コンテンツエリアを開く処理
     *
     * @param startBlockSize - アニメーション開始前のコンテンツを囲う要素の高さ
     */
    #open(startBlockSize) {
        this.open = true;
        const endBlockSize = this.#detailsContentBlockSize ?? this.#getContentBlockSize();
        this.#animation = this.#detailsContentElement.animate({
            [new HTMLElementUtil(this.#detailsContentElement).getWritingMode() === 'horizontal' ? 'height' : 'width']: [`${startBlockSize}px`, `${endBlockSize}px`],
        }, this.#keyframeAnimationOptions);
        this.#animation.onfinish = () => {
            this.#detailsContentBlockSize = this.#getContentBlockSize();
            this.#detailsContentElement.style.blockSize = '';
        };
    }
    /**
     * コンテンツエリアを閉じる処理
     */
    #close() {
        const startBlockSize = this.#getContentBlockSize();
        this.#detailsContentBlockSize = startBlockSize;
        this.#animation = this.#detailsContentElement.animate({
            [new HTMLElementUtil(this.#detailsContentElement).getWritingMode() === 'horizontal' ? 'height' : 'width']: [`${startBlockSize}px`, '0px'],
        }, this.#keyframeAnimationOptions);
        this.#animation.onfinish = () => {
            this.open = false;
            this.#detailsContentBlockSize = null;
            this.#detailsContentElement.style.blockSize = '';
        };
    }
    /**
     * block-size を取得する
     *
     * @returns block-size
     */
    #getContentBlockSize() {
        const targetElement = this.#detailsContentElement;
        return new HTMLElementUtil(targetElement).getWritingMode() === 'vertical' ? targetElement.offsetWidth : targetElement.offsetHeight;
    }
}
//# sourceMappingURL=DetailsAnimation.js.map