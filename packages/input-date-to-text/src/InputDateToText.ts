/**
 * Convert date control to `<input type=text>`
 */
export default class {
	readonly #inputElement: HTMLInputElement; // `<input>` 要素

	readonly #noexistMessage: string;

	readonly #min?: string;

	readonly #minMessage?: string;

	readonly #max?: string;

	readonly #maxMessage?: string;

	readonly #formSubmitEventListener: (ev: Event) => void;

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLInputElement) {
		this.#inputElement = thisElement;

		const { title, validationNoexist, validationMin, validationMax } = thisElement.dataset;

		if (validationNoexist === undefined) {
			throw new Error('Attribute: `data-validation-noexist` is not set.');
		}
		this.#noexistMessage = validationNoexist;

		/* 日付コントロールを <input type="text"> に置換 */
		if (thisElement.min !== '') {
			if (validationMin === undefined) {
				throw new Error('Attribute: `data-validation-min` is not set.');
			}

			this.#min = thisElement.min;
			this.#minMessage = validationMin;
			thisElement.removeAttribute('min');
		}

		if (thisElement.max !== '') {
			if (validationMax === undefined) {
				throw new Error('Attribute: `data-validation-max` is not set.');
			}

			this.#max = thisElement.max;
			this.#maxMessage = validationMax;
			thisElement.removeAttribute('max');
		}

		if (thisElement.step !== '') {
			thisElement.removeAttribute('step'); // TODO: `step` 属性指定時の挙動は未実装
		}

		thisElement.type = 'text';
		thisElement.minLength = 8;
		thisElement.pattern = '([0-9０-９]{8})|([0-9０-９]{4}[\\-\\/－／][0-9０-９]{1,2}[\\-\\/－／][0-9０-９]{1,2})';
		thisElement.placeholder = 'YYYY-MM-DD';
		if (title !== undefined) {
			thisElement.title = title;
		}

		this.#formSubmitEventListener = this.#formSubmitEvent.bind(this);

		thisElement.addEventListener('change', this.#changeEvent, { passive: true });
		thisElement.form?.addEventListener('submit', this.#formSubmitEventListener);
	}

	/**
	 * フォームコントロールの内容が変更されたときの処理
	 */
	#changeEvent = (): void => {
		if (this.#inputElement.validity.patternMismatch) {
			/* ブラウザ標準機能によるチェックを優先する */
			return;
		}

		this.#convertValue();

		this.#validate();
	};

	/**
	 * フォーム送信時の処理
	 *
	 * @param ev - Event
	 */
	#formSubmitEvent(ev: Event): void {
		this.#convertValue();

		if (!this.#validate()) {
			ev.preventDefault();
		}
	}

	/**
	 * 入力値を変換（整形）する
	 */
	#convertValue(): void {
		const valueTrim = this.#inputElement.value.trim();
		if (valueTrim === '') {
			this.#inputElement.value = valueTrim;
			return;
		}

		/* 数字を半角化 */
		const valueHankaku = valueTrim.replace(/[０-９－／]/g, (str) => String.fromCharCode(str.charCodeAt(0) - 0xfee0));

		if (/^[0-9]{8}$/.test(valueHankaku)) {
			/* e.g. 20000101 → 2000-01-01 */
			this.#inputElement.value = `${valueHankaku.substring(0, 4)}-${valueHankaku.substring(4, 6)}-${valueHankaku.substring(6)}`;
			return;
		}

		/* e.g. 2000/1/1 → 2000-01-01, 2000-1-1 → 2000-01-01 */
		const { 0: year, 1: month, 2: day } = valueHankaku.replaceAll('/', '-').split('-');
		this.#inputElement.value = `${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`;
	}

	/**
	 * バリデーションを実行
	 *
	 * @returns バリデーションが通れば true
	 */
	#validate(): boolean {
		const { value } = this.#inputElement;
		if (value === '') {
			return true;
		}

		const valueYear = Number(value.substring(0, 4));
		const valueMonth = Number(value.substring(5, 7)) - 1;
		const valueDay = Number(value.substring(8, 10));
		const valueDate = new Date(valueYear, valueMonth, valueDay);

		if (valueDate.getFullYear() !== valueYear || valueDate.getMonth() !== valueMonth || valueDate.getDate() !== valueDay) {
			/* 2月30日など存在しない日付の場合 */
			this.#setMessage(this.#noexistMessage);
			return false;
		}

		if (
			this.#min !== undefined &&
			valueDate < new Date(Number(this.#min.substring(0, 4)), Number(this.#min.substring(5, 7)) - 1, Number(this.#min.substring(8, 10)))
		) {
			/* min 属性値より過去の日付を入力した場合 */
			this.#setMessage(this.#minMessage);
			return false;
		}

		if (
			this.#max !== undefined &&
			valueDate > new Date(Number(this.#max.substring(0, 4)), Number(this.#max.substring(5, 7)) - 1, Number(this.#max.substring(8, 10)))
		) {
			/* max 属性値より未来の日付を入力した場合 */
			this.#setMessage(this.#maxMessage);
			return false;
		}

		this.#clearMessage();
		return true;
	}

	/**
	 * カスタムバリデーション文言を設定
	 *
	 * @param message - カスタムバリデーション文言
	 */
	#setMessage(message: string | undefined): void {
		if (message === undefined) {
			return;
		}

		this.#inputElement.setCustomValidity(message);

		this.#inputElement.dispatchEvent(new Event('invalid'));
	}

	/**
	 * カスタムバリデーション文言を削除
	 */
	#clearMessage(): void {
		this.#inputElement.setCustomValidity('');
	}
}
