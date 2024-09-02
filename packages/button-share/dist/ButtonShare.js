import Text from './attribute/Text.js';
import Title from './attribute/Title.js';
import Url from './attribute/Url.js';
/**
 * Share button
 */
export default class {
    #text;
    #title;
    #url;
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (navigator.share === undefined) {
            thisElement.disabled = true;
            return;
        }
        const { text: textAttribute, title: titleAttribute, url: urlAttribute } = thisElement.dataset;
        this.#text = new Text(textAttribute);
        this.#title = new Title(titleAttribute);
        this.#url = new Url(urlAttribute);
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        thisElement.addEventListener('click', this.#clickEvent, { passive: true });
    }
    /**
     * ボタン押下時の処理
     */
    #clickEvent = async () => {
        await navigator.share({
            /* files: TODO: */
            text: this.#text?.text ?? '',
            title: this.#title?.text ?? document.title,
            url: this.#url?.url?.toString() ?? document.URL,
        });
    };
}
//# sourceMappingURL=ButtonShare.js.map