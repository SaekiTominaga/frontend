import CustomElementPopover, {} from './CustomElementPopover.js';
customElements.define('x-popover', CustomElementPopover);
/**
 * Footnote reference popover
 */
export default class {
    #popoverTriggerElement;
    #footnoteElement; // 脚注要素（ポップオーバーの内容をここからコピーする）
    #popoverElement;
    #popoverLabel; // ポップオーバーに設定するラベル
    #popoverClass; // ポップオーバーに設定するクラス名
    #popoverHideText; // ポップオーバーの閉じるボタンのテキスト
    #popoverHideImageSrc; // ポップオーバーの閉じるボタンの画像パス
    #popoverHideImageWidth; // ポップオーバーの閉じるボタンの画像幅
    #popoverHideImageHeight; // ポップオーバーの閉じるボタンの画像高さ
    #mouseenterDelay = 250; // mouseenter 時にポップオーバーを表示する遅延時間（ミリ秒）
    #mouseleaveDelay = 250; // mouseleave 時にポップオーバーを非表示にする遅延時間（ミリ秒）
    #mouseenterTimeoutId; // ポップオーバーを表示する際のタイマーの識別 ID（`clearTimeout()` で使用）
    #mouseleaveTimeoutId; // ポップオーバーを非表示にする際のタイマーの識別 ID（`clearTimeout()` で使用）
    #preloadProcessed = false; // `<link rel="preload" as="image" />` の生成処理を実行したかどうか
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        this.#popoverTriggerElement = thisElement;
        const { href } = thisElement;
        const { popoverLabel, popoverClass, popoverHideText, popoverHideImageSrc, popoverHideImageWidth, popoverHideImageHeight, mouseenterDelay, mouseleaveDelay, } = thisElement.dataset;
        if (href === '') {
            throw new Error('Attribute: `href` is not set.');
        }
        const footnoteUrl = new URL(href);
        if (footnoteUrl.origin !== location.origin || footnoteUrl.pathname !== location.pathname) {
            throw new Error('Attribute: `href` value must be in the same content.');
        }
        const footnoteId = footnoteUrl.hash.substring(1);
        const footnoteElement = document.getElementById(footnoteId);
        if (footnoteElement === null) {
            throw new Error(`Element: #${footnoteId} can not found.`);
        }
        this.#footnoteElement = footnoteElement;
        this.#popoverLabel = popoverLabel;
        this.#popoverClass = popoverClass;
        this.#popoverHideText = popoverHideText;
        this.#popoverHideImageSrc = popoverHideImageSrc;
        if (popoverHideImageWidth !== undefined) {
            this.#popoverHideImageWidth = Number(popoverHideImageWidth);
        }
        if (popoverHideImageHeight !== undefined) {
            this.#popoverHideImageHeight = Number(popoverHideImageHeight);
        }
        if (mouseenterDelay !== undefined) {
            this.#mouseenterDelay = Number(mouseenterDelay);
        }
        if (mouseleaveDelay !== undefined) {
            this.#mouseleaveDelay = Number(mouseleaveDelay);
        }
        this.#popoverElement = document.createElement('x-popover');
        if (!('showPopover' in this.#popoverElement)) {
            console.info('This browser does not support popover');
            return;
        }
        thisElement.setAttribute('role', 'button');
        thisElement.addEventListener('click', this.#clickEvent);
        thisElement.addEventListener('mouseenter', this.#mouseEnterEvent, { passive: true });
        thisElement.addEventListener('mouseleave', this.#mouseLeaveEvent, { passive: true });
    }
    /**
     * `click` event
     *
     * @param ev - MouseEvent
     */
    #clickEvent = (ev) => {
        ev.preventDefault();
        clearTimeout(this.#mouseleaveTimeoutId);
        this.#show(ev.type);
    };
    /**
     * `mouseenter` event
     *
     * @param ev - MouseEvent
     */
    #mouseEnterEvent = (ev) => {
        clearTimeout(this.#mouseleaveTimeoutId);
        this.#imagePreloadElementCreate();
        this.#mouseenterTimeoutId = setTimeout(() => {
            this.#show(ev.type);
        }, this.#mouseenterDelay);
    };
    /**
     * `mouseleave` event
     *
     * @param ev - MouseEvent
     */
    #mouseLeaveEvent = (ev) => {
        clearTimeout(this.#mouseenterTimeoutId);
        this.#mouseleaveTimeoutId = setTimeout(() => {
            this.#hide(ev.type);
        }, this.#mouseleaveDelay);
    };
    /**
     * ポップオーバーを生成する
     */
    #create() {
        const popoverElement = this.#popoverElement;
        if (this.#popoverClass !== undefined) {
            popoverElement.className = this.#popoverClass;
        }
        popoverElement.label = this.#popoverLabel ?? null;
        popoverElement.hideText = this.#popoverHideText ?? null;
        popoverElement.hideImageSrc = this.#popoverHideImageSrc ?? null;
        popoverElement.hideImageWidth = this.#popoverHideImageWidth ?? null;
        popoverElement.hideImageHeight = this.#popoverHideImageHeight ?? null;
        popoverElement.insertAdjacentHTML('afterbegin', this.#footnoteElement.innerHTML);
        document.body.appendChild(popoverElement);
        popoverElement.addEventListener('mouseenter', (ev) => {
            clearTimeout(this.#mouseleaveTimeoutId);
            this.#mouseenterTimeoutId = setTimeout(() => {
                this.#show(ev.type);
            }, this.#mouseenterDelay);
        }, { passive: true });
        popoverElement.addEventListener('mouseleave', (ev) => {
            clearTimeout(this.#mouseenterTimeoutId);
            this.#mouseleaveTimeoutId = setTimeout(() => {
                this.#hide(ev.type);
            }, this.#mouseleaveDelay);
        }, { passive: true });
        popoverElement.hideButtonElement.addEventListener('click', () => {
            clearTimeout(this.#mouseenterTimeoutId); // タッチデバイスで閉じるボタンをタップした際に `mouseenter` イベントの発火により表示処理が遅延実行されるのを防ぐ
        }, { passive: true });
    }
    /**
     * ポップオーバーを表示する
     *
     * @param eventType - イベントの識別名
     */
    #show(eventType) {
        const popoverElement = this.#popoverElement;
        if (!popoverElement.isConnected) {
            /* 初回表示時はポップオーバーの生成を行う */
            this.#create();
        }
        const triggerRect = this.#popoverTriggerElement.getBoundingClientRect();
        /* ポップオーバーの上位置を設定（トリガー要素の下端を基準にする） */
        popoverElement.style.width = 'auto';
        popoverElement.style.top = `${String(Math.round(triggerRect.bottom) + window.scrollY)}px`;
        popoverElement.style.right = 'auto';
        popoverElement.style.left = 'auto';
        /* ポップオーバーを表示 */
        const eventDetail = {
            newState: 'open',
            eventType: eventType,
        };
        popoverElement.dispatchEvent(new CustomEvent('my-toggle', {
            detail: eventDetail,
        }));
        /* ポップオーバーの左右位置を設定（トリガー要素の左端を基準にする） */
        const documentWidth = document.documentElement.offsetWidth;
        const popoverWidth = popoverElement.width;
        const triggerRectLeft = triggerRect.left;
        popoverElement.style.width = `${String(popoverWidth)}px`;
        if (documentWidth - triggerRectLeft < popoverWidth) {
            popoverElement.style.right = '0';
        }
        else {
            popoverElement.style.left = `${String(triggerRectLeft)}px`;
        }
    }
    /**
     * ポップオーバーを非表示にする
     *
     * @param eventType - イベントの識別名
     */
    #hide(eventType) {
        const eventDetail = {
            newState: 'closed',
            eventType: eventType,
        };
        this.#popoverElement.dispatchEvent(new CustomEvent('my-toggle', {
            detail: eventDetail,
        }));
    }
    /**
     * `<link rel="preload" as="image" />` を生成する
     */
    #imagePreloadElementCreate() {
        if (this.#preloadProcessed) {
            /* 生成処理は1回のみ */
            return;
        }
        this.#preloadProcessed = true;
        const popoverHideImageSrc = this.#popoverHideImageSrc;
        if (popoverHideImageSrc !== undefined &&
            !popoverHideImageSrc.trimStart().startsWith('data:') &&
            document.querySelector(`link[rel="preload"][as="image"][href="${popoverHideImageSrc}"]`) === null) {
            const parentElement = document.head;
            const preloadElement = document.createElement('link');
            preloadElement.rel = 'preload';
            preloadElement.as = 'image';
            preloadElement.href = popoverHideImageSrc;
            const alreadyHeadLinkElements = parentElement.querySelectorAll('link');
            if (alreadyHeadLinkElements.length === 0) {
                parentElement.appendChild(preloadElement);
            }
            else {
                [...alreadyHeadLinkElements].at(-1)?.insertAdjacentElement('afterend', preloadElement);
            }
        }
    }
}
//# sourceMappingURL=FootnoteReferencePopover.js.map