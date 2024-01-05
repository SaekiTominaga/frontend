export default class URLUtil {
    #url;
    /**
     * @param url - URL
     */
    constructor(url) {
        this.#url = url;
    }
    /**
     * Get the URL object of the parent page（e.g. https://example.com/foo/bar/ → https://example.com/foo/ ）
     *
     * @returns Parent page (Own page if parent page does not exist)
     */
    getParentPage() {
        return new URL(this.#url.pathname.endsWith('/') ? '../' : './', this.#url);
    }
}
//# sourceMappingURL=URLUtil.js.map