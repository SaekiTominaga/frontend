export default class {
	readonly #element: HTMLElement;

	constructor(element: HTMLElement) {
		this.#element = element;
	}

	/**
	 * Get the contents of an HTMLElement (e.g. `Node.textContent`)
	 *
	 * @returns Contents
	 */
	getContent(): string {
		const { textContent } = this.#element;
		if (textContent === null) {
			throw new Error('Node is not an HTMLElement.'); // ノードが HTMLElement である場合、`Node.textContent` の値が null になることはない（空要素は空文字列を返す）
		}

		switch (this.#element.tagName.toLowerCase()) {
			case 'data':
			case 'input':
			case 'select':
			case 'textarea':
			case 'output':
				return (this.#element as HTMLDataElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLOutputElement).value;
			case 'meta':
				return (this.#element as HTMLMetaElement).content;
			case 'pre':
				return textContent;
			default:
		}

		return textContent.trim();
	}
}
