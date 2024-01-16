/**
 * Footnote reference popover
 */
export default class {
    #popoverTriggerElement;
    #footnoteElement; // 脚注要素（ポップオーバーの内容をここからコピーする）
    #popoverId;
    #popoverWrapElement;
    #popoverElement;
    #popoverIdPrefix = 'popover-'; // ポップオーバーに設定する ID の接頭辞
    #mouseenterTimeoutId; // ポップオーバーを表示する際のタイマーの識別 ID（clearTimeout() で使用）
    #mouseleaveTimeoutId; // ポップオーバーを非表示にする際のタイマーの識別 ID（clearTimeout() で使用）
    #popoverLabel; // ポップオーバーに設定するラベル
    #popoverClass; // ポップオーバーに設定するクラス名
    #popoverCloseText = 'Close'; // ポップオーバーの閉じるボタンのテキスト
    #popoverCloseImageSrc; // ポップオーバーの閉じるボタンの画像パス
    #popoverMouseenterDelay = 250; // mouseenter 時にポップオーバーを表示する遅延時間（ミリ秒）
    #popoverMouseleaveDelay = 250; // mouseleave 時にポップオーバーを非表示にする遅延時間（ミリ秒）
    #popoverCloseEventListener;
    #popoverKeydownEventListener;
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        this.#popoverTriggerElement = thisElement;
        const { href } = thisElement;
        const { popoverLabel, popoverClass, popoverCloseText, popoverCloseImageSrc, popoverMouseenterDelay, popoverMouseleaveDelay } = thisElement.dataset;
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
        this.#popoverId = `${this.#popoverIdPrefix}${footnoteId}`;
        this.#popoverLabel = popoverLabel;
        this.#popoverClass = popoverClass;
        if (popoverCloseText !== undefined) {
            this.#popoverCloseText = popoverCloseText;
        }
        this.#popoverCloseImageSrc = popoverCloseImageSrc;
        if (popoverMouseenterDelay !== undefined) {
            this.#popoverMouseenterDelay = Number(popoverMouseenterDelay);
        }
        if (popoverMouseleaveDelay !== undefined) {
            this.#popoverMouseleaveDelay = Number(popoverMouseleaveDelay);
        }
        this.#popoverWrapElement = document.createElement('x-popover');
        this.#popoverElement = document.createElement('dialog');
        thisElement.setAttribute('role', 'button');
        thisElement.setAttribute('aria-controls', this.#popoverId);
        thisElement.setAttribute('aria-expanded', 'false');
        thisElement.addEventListener('mouseenter', this.#mouseEnterEvent, { passive: true });
        thisElement.addEventListener('mouseleave', this.#mouseLeaveEvent, { passive: true });
        thisElement.addEventListener('click', this.#clickEvent);
        this.#popoverCloseEventListener = this.#popoverCloseEvent.bind(this);
        this.#popoverKeydownEventListener = this.#popoverKeydownEvent.bind(this);
        /* Image preload */
        if (popoverCloseImageSrc !== undefined &&
            !popoverCloseImageSrc.trimStart().startsWith('data:') &&
            document.querySelector(`link[rel="preload"][href="${popoverCloseImageSrc}"]`) === null) {
            const preloadElement = document.createElement('link');
            preloadElement.rel = 'preload';
            preloadElement.as = 'image';
            preloadElement.href = popoverCloseImageSrc;
            const alreadyHeadLinkElements = document.head.querySelectorAll('link');
            if (alreadyHeadLinkElements.length === 0) {
                document.head.appendChild(preloadElement);
            }
            else {
                [...alreadyHeadLinkElements].at(-1)?.insertAdjacentElement('afterend', preloadElement);
            }
        }
    }
    /**
     * `mouseenter` event
     */
    #mouseEnterEvent = () => {
        clearTimeout(this.#mouseleaveTimeoutId);
        this.#mouseenterTimeoutId = setTimeout(() => {
            this.#show();
        }, this.#popoverMouseenterDelay);
    };
    /**
     * `mouseleave` event
     */
    #mouseLeaveEvent = () => {
        clearTimeout(this.#mouseenterTimeoutId);
        this.#mouseleaveTimeoutId = setTimeout(() => {
            this.#popoverElement.dispatchEvent(new Event('close'));
        }, this.#popoverMouseleaveDelay);
    };
    /**
     * `click` event
     *
     * @param ev - MouseEvent
     */
    #clickEvent = (ev) => {
        clearTimeout(this.#mouseleaveTimeoutId);
        this.#show({
            focus: true,
        });
        ev.preventDefault();
    };
    /**
     * popover `close` event
     */
    #popoverCloseEvent() {
        this.#popoverTriggerElement.setAttribute('aria-expanded', 'false');
        this.#popoverWrapElement.hidden = true;
        document.removeEventListener('keydown', this.#popoverKeydownEventListener);
    }
    /**
     * popover `keydown` event
     *
     * @param ev - KeyboardEvent
     */
    #popoverKeydownEvent(ev) {
        switch (ev.key) {
            case 'Escape': {
                ev.preventDefault();
                clearTimeout(this.#mouseenterTimeoutId);
                this.#popoverElement.dispatchEvent(new Event('close'));
                break;
            }
            default:
        }
    }
    /**
     * ポップオーバーを生成する
     */
    #create() {
        const popoverWrapElement = this.#popoverWrapElement;
        popoverWrapElement.hidden = true;
        document.body.appendChild(popoverWrapElement);
        const popoverElement = this.#popoverElement;
        popoverElement.id = this.#popoverId;
        popoverElement.autofocus = true;
        if (this.#popoverClass !== undefined) {
            popoverElement.className = this.#popoverClass;
        }
        if (this.#popoverLabel !== undefined) {
            popoverElement.setAttribute('aria-label', this.#popoverLabel);
        }
        popoverElement.insertAdjacentHTML('afterbegin', this.#footnoteElement.innerHTML);
        for (const element of popoverElement.querySelectorAll('[id]')) {
            /* コピー元の HTML 中に id 属性が設定されていた場合、ページ中に ID が重複してしまうのを防ぐ */
            element.removeAttribute('id');
        }
        popoverElement.addEventListener('close', this.#popoverCloseEventListener, { passive: true });
        popoverElement.addEventListener('mouseenter', () => {
            clearTimeout(this.#mouseleaveTimeoutId);
            this.#mouseenterTimeoutId = setTimeout(() => {
                this.#show();
            }, this.#popoverMouseenterDelay);
        }, { passive: true });
        popoverElement.addEventListener('mouseleave', () => {
            clearTimeout(this.#mouseenterTimeoutId);
            this.#mouseleaveTimeoutId = setTimeout(() => {
                this.#popoverElement.dispatchEvent(new Event('close'));
            }, this.#popoverMouseleaveDelay);
        }, { passive: true });
        popoverWrapElement.appendChild(popoverElement);
        const formElement = document.createElement('form');
        formElement.method = 'dialog';
        popoverElement.appendChild(formElement);
        const closeButtonElement = document.createElement('button');
        if (this.#popoverCloseImageSrc === undefined) {
            closeButtonElement.textContent = this.#popoverCloseText;
        }
        else {
            const closeButtonImageElement = document.createElement('img');
            closeButtonImageElement.src = this.#popoverCloseImageSrc;
            closeButtonImageElement.alt = this.#popoverCloseText;
            closeButtonElement.appendChild(closeButtonImageElement);
        }
        formElement.appendChild(closeButtonElement);
        /* 循環フォーカス */
        const firstFocusableElement = document.createElement('span');
        firstFocusableElement.tabIndex = 0;
        firstFocusableElement.addEventListener('focus', () => {
            closeButtonElement.focus();
        }, { passive: true });
        popoverWrapElement.insertAdjacentElement('afterbegin', firstFocusableElement);
        const lastFocusableElement = document.createElement('span');
        lastFocusableElement.tabIndex = 0;
        lastFocusableElement.addEventListener('focus', () => {
            popoverElement.focus();
        }, { passive: true });
        popoverWrapElement.insertAdjacentElement('beforeend', lastFocusableElement);
    }
    /**
     * ポップオーバーを表示する
     *
     * @param options - オプション
     * @param options.focus - ポップオーバーにフォーカスを行うか
     */
    #show(options = { focus: false }) {
        if (!this.#popoverElement.isConnected) {
            /* 初回表示時はポップオーバーの生成を行う */
            this.#create();
        }
        const popoverElement = this.#popoverElement;
        this.#popoverTriggerElement.setAttribute('aria-expanded', 'true');
        /* 表示位置を設定する */
        const triggerRect = this.#popoverTriggerElement.getBoundingClientRect();
        /* ポップオーバーの上位置を設定（トリガー要素の下端を基準にする） */
        popoverElement.style.top = `${String(Math.round(triggerRect.bottom) + window.pageYOffset)}px`;
        popoverElement.show();
        this.#popoverWrapElement.hidden = false;
        document.addEventListener('keydown', this.#popoverKeydownEventListener);
        const documentWidth = document.documentElement.offsetWidth;
        const popoverWidth = popoverElement.getBoundingClientRect().width;
        /* ポップオーバーの左右位置を設定（トリガー要素の左端を基準にする） */
        /* いったんリセット */
        popoverElement.style.left = 'auto';
        popoverElement.style.right = 'auto';
        /* 設定 */
        if (documentWidth - triggerRect.left < popoverWidth) {
            popoverElement.style.right = '0';
        }
        else {
            popoverElement.style.left = `${String(Math.round(triggerRect.left))}px`;
        }
        if (options.focus) {
            popoverElement.focus(); // TODO: 将来的には show() のパラメーターで指定できるようになる? https://github.com/whatwg/html/wiki/dialog--initial-focus,-a-proposal#initial-dialog-focus-logic
        }
    }
}
//# sourceMappingURL=FootnoteReferencePopover.js.map