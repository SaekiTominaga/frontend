import MIMEType from 'whatwg-mimetype';
import URLUtil from './URLUtil.js';
/**
 * Get the data of the HTML page of the nearest ancestor hierarchy
 */
export default class ClosestHTMLPage {
    #maxFetchCount; // fetch() の最大試行回数
    #fetchOptions; // fetch() 関数に指定するオプション
    #mimeTypes; // 取得するリソースの MIME タイプ
    #fetchedResponses = new Set(); // fetch() した Response 情報
    /* もっとも近い祖先階層の HTML ページのデータ */
    #url = null; // URL
    #title = null; // タイトル
    /**
     * @param options - Options for accessing web content
     */
    constructor(options) {
        if (options?.maxFetchCount !== undefined) {
            if (!Number.isInteger(options.maxFetchCount)) {
                throw new TypeError('Argument `maxFetchCount` must be an integer.');
            }
            if (options.maxFetchCount < 0) {
                throw new RangeError('Argument `maxFetchCount` must be greater than or equal to 0.');
            }
        }
        this.#maxFetchCount = options?.maxFetchCount ?? 0;
        this.#fetchOptions = options?.fetchOptions;
        this.#mimeTypes = options?.mimeTypes ?? ['text/html', 'application/xhtml+xml'];
    }
    /**
     * Traverse the ancestor hierarchy in order from the base URL and retrieve the data of resources that match the specified condition (MIME types).
     *
     * @param baseUrl - Base URL
     */
    async fetch(baseUrl = location.toString()) {
        let url = new URL(baseUrl);
        while (url.pathname !== '/' && (this.#maxFetchCount === 0 || this.#maxFetchCount > this.#fetchedResponses.size)) {
            url = new URLUtil(url).getParentPage();
            const response = await fetch(`${url.origin}${url.pathname}`, this.#fetchOptions);
            this.#fetchedResponses.add(response);
            console.info(`【Fetch API】${response.url} [${[String(response.status), response.statusText].filter((s) => s !== '').join(' ')}]`);
            if (!response.ok) {
                continue;
            }
            const mimeType = response.headers.get('content-type');
            if (mimeType === null) {
                throw new Error(`Missing "Content-Type" in response header for URL <${response.url}>`);
            }
            /* MIME タイプからパラメーターを除去（e.g 'text/html; charset=utf-8' → 'text/html'） */
            const mimeTypeEssence = new MIMEType(mimeType).essence;
            if (!this.#mimeTypes.includes(mimeTypeEssence)) {
                /* 指定された MIME タイプにマッチしない場合 */
                continue;
            }
            /* 諸条件を満たした場合 */
            this.#url = response.url;
            const doc = new DOMParser().parseFromString(await response.text(), mimeTypeEssence);
            /* OGP からタイトルを取得し、指定されていない場合は <title> 要素から取得する */
            this.#title = doc.querySelector('meta[property="og:title"]')?.content ?? doc.querySelector('title')?.textContent ?? null;
            break;
        }
    }
    /**
     * Get the `Response` data resulting from the execution of `fetch()`.
     *
     * @returns `Response` datas
     */
    getFetchedResponses() {
        return this.#fetchedResponses;
    }
    /**
     * Get the URL of the HTML page of the nearest ancestor hierarchy.
     *
     * @returns URL
     */
    getUrl() {
        return this.#url;
    }
    /**
     * Get the title of the HTML page of the nearest ancestor hierarchy.
     *
     * @returns Title
     */
    getTitle() {
        return this.#title;
    }
}
//# sourceMappingURL=ClosestHTMLPage.js.map