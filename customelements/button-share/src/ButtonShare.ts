/**
 * Share button
 */
export default class ButtonShare extends HTMLButtonElement {
	#text: string | undefined;

	#title: string | undefined;

	#url: string | undefined;

	constructor() {
		super();

		this.type = 'button';

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (navigator.share === undefined) {
			this.disabled = true;
		}
	}

	connectedCallback(): void {
		const { shareText, shareTitle, shareUrl } = this.dataset;

		this.#text = shareText;
		this.#title = shareTitle;
		this.#url = shareUrl;

		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this.addEventListener('click', this.#clickEvent, { passive: true });
	}

	disconnectedCallback(): void {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this.removeEventListener('click', this.#clickEvent);
	}

	/**
	 * ボタン押下時の処理
	 */
	#clickEvent = async (): Promise<void> => {
		await navigator.share({
			// TODO: files
			text: this.#text ?? '',
			title: this.#title ?? document.title,
			url: this.#url ?? document.URL,
		});
	};
}
