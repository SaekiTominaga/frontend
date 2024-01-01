import { v4 as uuidv4 } from 'uuid';

/**
 * Button to check / uncheck checkboxes group
 */
export default class {
	readonly #course: 'check' | 'uncheck'; // ボタンの機能（全選択 or 全解除）

	readonly #checkboxElements: HTMLInputElement[] = []; // 制御対象のチェックボックス

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLButtonElement) {
		const { course, control, controlsClass, controlsName } = thisElement.dataset;

		switch (course) {
			case 'check':
			case 'uncheck':
				this.#course = course;
				break;
			case undefined:
				throw new Error('Attribute: `data-course` is not set.');
			default:
				throw new Error("Only 'check' or 'uncheck' can be set for the `data-course` attribute.");
		}

		if (control === undefined && controlsClass === undefined && controlsName === undefined) {
			throw new Error('Attribute: `data-control` or `data-controls-class` or `data-controls-name` is not set.');
		}

		if (control !== undefined) {
			const checkboxGroupElement = document.getElementById(control);
			if (checkboxGroupElement === null) {
				throw new Error(`Element: #${control} can not found.`);
			}

			const checkboxElements = checkboxGroupElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
			if (checkboxElements.length === 0) {
				throw new Error(`Checkbox does not exist in descendants of the Element: #${control}.`);
			}

			this.#checkboxElements = this.#checkboxElements.concat(Array.from(checkboxElements));
		}

		if (controlsClass !== undefined) {
			const checkboxElements = document.getElementsByClassName(controlsClass) as HTMLCollectionOf<HTMLInputElement>;
			if (checkboxElements.length === 0) {
				throw new Error(`Element: .${controlsClass} can not found.`);
			}

			this.#checkboxElements = this.#checkboxElements.concat(Array.from(checkboxElements));
		}

		if (controlsName !== undefined) {
			const checkboxElements = document.getElementsByName(controlsName) as NodeListOf<HTMLInputElement>;
			if (checkboxElements.length === 0) {
				throw new Error(`Element: [name=${controlsName}] can not found.`);
			}

			this.#checkboxElements = this.#checkboxElements.concat(Array.from(checkboxElements));
		}

		/* `aria-controls` の設定 */
		if (thisElement.getAttribute('aria-controls') === null) {
			const checkboxIds: string[] = [];

			this.#checkboxElements.forEach((element): void => {
				if (element.id === '') {
					element.id = uuidv4(); // チェックボックスの ID が指定されていない場合はランダム生成
				}
				checkboxIds.push(element.id);
			});

			thisElement.setAttribute('aria-controls', checkboxIds.join(' '));
		}

		thisElement.addEventListener('click', this.#clickEvent, { passive: true });
	}

	/**
	 * ボタン押下時の処理
	 */
	#clickEvent = (): void => {
		switch (this.#course) {
			case 'check': {
				/* チェックボックスをすべてチェックする */
				for (const checkboxUncheckedElement of this.#checkboxElements.filter((element) => !element.checked)) {
					checkboxUncheckedElement.checked = true;
				}
				break;
			}
			case 'uncheck': {
				/* チェックボックスをすべて解除する */
				for (const checkboxCheckedElement of this.#checkboxElements.filter((element) => element.checked)) {
					checkboxCheckedElement.checked = false;
				}
				break;
			}
			default:
		}
	};
}
