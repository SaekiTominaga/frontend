/**
 * Share button
 */
export default class ButtonShare extends HTMLButtonElement {
    #text;
    #title;
    #url;
    constructor() {
        super();
        this.type = 'button';
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (navigator.share === undefined) {
            this.disabled = true;
        }
    }
    connectedCallback() {
        const { shareText, shareTitle, shareUrl } = this.dataset;
        this.#text = shareText;
        this.#title = shareTitle;
        this.#url = shareUrl;
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.addEventListener('click', this.#clickEvent, { passive: true });
    }
    disconnectedCallback() {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.removeEventListener('click', this.#clickEvent);
    }
    /**
     * ボタン押下時の処理
     */
    #clickEvent = async () => {
        await navigator.share({
            // TODO: files
            text: this.#text ?? '',
            title: this.#title ?? document.title,
            url: this.#url ?? document.URL,
        });
    };
}
//# sourceMappingURL=ButtonShare.js.map