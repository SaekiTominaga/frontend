export default class URLUtil {
	#url: URL;

	/**
	 * @param url - URL
	 */
	constructor(url: URL) {
		this.#url = url;
	}

	/**
	 * Get the URL object of the parent page（e.g. https://example.com/foo/bar/ → https://example.com/foo/ ）
	 *
	 * @returns Parent page (Own page if parent page does not exist)
	 */
	getParentPage(): URL {
		return new URL(this.#url.pathname.endsWith('/') ? '../' : './', this.#url);
	}
}
