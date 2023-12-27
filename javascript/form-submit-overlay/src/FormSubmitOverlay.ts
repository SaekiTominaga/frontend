/**
 * Cover the entire screen with an overlay when form submitting
 */
export default class {
	readonly #thisElement: HTMLFormElement; // 対象要素

	#overlayElement?: HTMLDialogElement; // ロード中メッセージを表示する要素

	readonly #submitEventListener: () => void;

	readonly #windowUnloadEventListener: () => void;

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLFormElement) {
		this.#thisElement = thisElement;

		this.#submitEventListener = this.#submitEvent.bind(this);
		this.#windowUnloadEventListener = this.#windowUnloadEvent.bind(this);
	}

	/**
	 * Initial processing
	 */
	init(): void {
		const overlayElementId = this.#thisElement.dataset['overlayedBy'];
		if (overlayElementId === undefined) {
			throw new Error('Attribute: `data-overlayed-by` is not set.');
		}

		const overlayElement = document.getElementById(overlayElementId);
		if (overlayElement === null) {
			throw new Error(`Element: #${overlayElementId} can not found.`);
		}
		if (!('showModal' in overlayElement)) {
			throw new Error(`Element: #${overlayElementId} must be a \`<dialog>\` element.`);
		}
		this.#overlayElement = overlayElement as HTMLDialogElement;

		this.#thisElement.addEventListener('submit', this.#submitEventListener, { passive: true });
		window.addEventListener('unload', this.#windowUnloadEventListener, { passive: true });
	}

	/**
	 * フォームが送信されたときの処理
	 */
	#submitEvent(): void {
		this.#overlayElement?.showModal();
	}

	/**
	 * window - unload の処理
	 */
	#windowUnloadEvent(): void {
		this.#overlayElement?.close();
	}
}
