/**
 * Input validation of form control
 */
export default class {
	readonly #thisElement: HTMLElement; // 対象要素

	readonly #formControlElements = new Set<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(); // フォームコントロール要素

	#messageElement!: HTMLElement; // バリデーションメッセージを表示する要素

	#patternMessage: string | undefined; // pattern 属性値にマッチしない場合のエラー文言

	readonly #changeEventListener: () => void;

	readonly #invalidEventListener: (ev: Event) => void;

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLElement) {
		this.#thisElement = thisElement;

		this.#changeEventListener = this.#changeEvent.bind(this);
		this.#invalidEventListener = this.#invalidEvent.bind(this);
	}

	/**
	 * Initial processing
	 */
	init(): void {
		const messageElementId = this.#thisElement.getAttribute('aria-errormessage');
		if (messageElementId === null) {
			throw new Error('Attribute: `aria-errormessage` is not set.');
		}

		const messageElement = document.getElementById(messageElementId);
		if (messageElement === null) {
			throw new Error(`Element: #${messageElementId} can not found.`);
		}
		messageElement.setAttribute('role', 'alert');
		this.#messageElement = messageElement;

		if (['input', 'select', 'textarea'].includes(this.#thisElement.tagName.toLowerCase())) {
			this.#formControlElements.add(this.#thisElement as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement);
		} else if (this.#thisElement.getAttribute('role') === 'radiogroup') {
			for (const inputRadioElement of this.#thisElement.querySelectorAll<HTMLInputElement>('input[type="radio"]')) {
				this.#formControlElements.add(inputRadioElement);
			}
		} else {
			throw new Error('The `FormControlValidation` feature can only be specified for <input>, <textarea> or <XXX role="radiogroup">.');
		}

		this.#patternMessage = this.#thisElement.dataset['validationMessagePattern'];

		for (const formControlElement of this.#formControlElements) {
			formControlElement.addEventListener('change', this.#changeEventListener, { passive: true });
			formControlElement.addEventListener('invalid', this.#invalidEventListener);
		}
	}

	/**
	 * フォームコントロールの内容が変更されたときの処理
	 */
	#changeEvent(): void {
		/* バリデーション文言をいったんクリア */
		this.#clearMessage();

		for (const formControlElement of this.#formControlElements) {
			if (!formControlElement.validity.valid) {
				/* バリデーション文言を設定 */
				formControlElement.dispatchEvent(new UIEvent('invalid'));
			}
		}
	}

	/**
	 * Invalid 発生時の処理
	 *
	 * @param ev - Event
	 */
	#invalidEvent(ev: Event): void {
		const targetElement = ev.currentTarget as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

		/* バリデーション文言を設定する */
		let message = targetElement.validationMessage; // ブラウザのデフォルトメッセージ

		const { validity } = targetElement;
		if (!validity.valueMissing) {
			if (validity.patternMismatch && this.#patternMessage !== undefined) {
				/* data-* 属性でカスタムエラー文言が設定されている場合 */
				message = this.#patternMessage;
			}
		}

		this.#setMessage(message);

		ev.preventDefault();
	}

	/**
	 * カスタムバリデーション文言を設定
	 *
	 * @param message - カスタムバリデーション文言
	 */
	#setMessage(message: string): void {
		this.#thisElement.setAttribute('aria-invalid', 'true');
		for (const formControlElement of this.#formControlElements) {
			formControlElement.setCustomValidity(message);
		}

		this.#messageElement.hidden = false;
		this.#messageElement.textContent = message;
	}

	/**
	 * カスタムバリデーション文言を削除
	 */
	#clearMessage(): void {
		this.#thisElement.setAttribute('aria-invalid', 'false');
		for (const formControlElement of this.#formControlElements) {
			formControlElement.setCustomValidity('');
		}

		this.#messageElement.hidden = true;
		this.#messageElement.textContent = '';
	}
}
