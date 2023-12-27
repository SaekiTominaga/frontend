/**
 * Button to check / uncheck checkboxes group
 */
export default class ButtonCheckboxes extends HTMLButtonElement {
	#course?: 'check' | 'uncheck'; // ボタンの機能（全選択 or 全解除）

	#checkboxElements: HTMLInputElement[] = []; // 対象のチェックボックス

	constructor() {
		super();

		this.type = 'button';
	}

	connectedCallback(): void {
		const { course, targetFor, targetsClass, targetsName } = this.dataset;

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

		if (targetFor === undefined && targetsClass === undefined && targetsName === undefined) {
			throw new Error('Attribute: `data-target-for` or `data-targets-class` or `data-targets-name` is not set.');
		}

		if (targetFor !== undefined) {
			const targetsAncestorElement = document.getElementById(targetFor);
			if (targetsAncestorElement === null) {
				throw new Error(`Element: #${targetFor} can not found.`);
			}

			const targetElements = targetsAncestorElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
			if (targetElements.length === 0) {
				throw new Error(`Checkbox does not exist in descendants of the Element: #${targetFor}.`);
			}

			this.#checkboxElements = this.#checkboxElements.concat(Array.from(targetElements));
		}

		if (targetsClass !== undefined) {
			const targetElements = document.getElementsByClassName(targetsClass) as HTMLCollectionOf<HTMLInputElement>;
			if (targetElements.length === 0) {
				throw new Error(`Element: .${targetsClass} can not found.`);
			}

			this.#checkboxElements = this.#checkboxElements.concat(Array.from(targetElements));
		}

		if (targetsName !== undefined) {
			const targetElements = document.getElementsByName(targetsName) as NodeListOf<HTMLInputElement>;
			if (targetElements.length === 0) {
				throw new Error(`Element: [name=${targetsName}] can not found.`);
			}

			this.#checkboxElements = this.#checkboxElements.concat(Array.from(targetElements));
		}

		this.addEventListener('click', this.#clickEvent, { passive: true });
	}

	disconnectedCallback(): void {
		this.removeEventListener('click', this.#clickEvent);
	}

	/**
	 * ボタン押下時の処理
	 */
	#clickEvent = () => {
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
