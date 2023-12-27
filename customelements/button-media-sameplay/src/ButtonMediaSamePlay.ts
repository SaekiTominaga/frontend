/**
 * Simultaneous playback button for multiple audio / video
 */
export default class ButtonMediaSamePlay extends HTMLButtonElement {
	readonly #targetElements: HTMLMediaElement[] = []; // 同時再生する要素

	#paused = true; // ボタンのステータス：一時停止中かどうか

	constructor() {
		super();

		this.type = 'button';
	}

	connectedCallback(): void {
		const { targetsFor: targetElementIdSpaceDelimiter } = this.dataset;

		const targetElementIds = targetElementIdSpaceDelimiter?.split(' ');
		if (targetElementIds === undefined) {
			throw new Error('Attribute: `data-targets-for` is not set.');
		}

		for (const targetElementId of targetElementIds) {
			const targetElement = document.getElementById(targetElementId) as HTMLMediaElement | null;
			if (targetElement === null) {
				throw new Error(`Element: #${targetElementId} can not found.`);
			}

			this.#targetElements.push(targetElement);
		}

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
		if (this.#targetElements.every((element) => element.ended)) {
			/* すべての動画が再生終了していたら最初から再生を始める */
			await Promise.all(
				this.#targetElements.map(async (targetElement) => {
					targetElement.currentTime = 0;
					await targetElement.play();
				}),
			);

			this.#paused = false;
		} else {
			if (this.#paused) {
				/* 一時停止中だったらもっとも再生時間が低い動画に合わせて再生する */
				const minTime = this.#targetElements.reduce((accumulator, currentValue) => {
					const element = accumulator.currentTime < currentValue.currentTime ? accumulator : currentValue;
					return element;
				}).currentTime; // すべての動画の中でもっとも再生時間が低いもの

				await Promise.all(
					this.#targetElements.map(async (targetElement) => {
						targetElement.currentTime = minTime;
						await targetElement.play();
					}),
				);
			} else {
				/* 再生中だったら一時停止する */
				this.#targetElements.forEach((targetElement) => {
					targetElement.pause();
				});
			}

			this.#paused = !this.#paused;
		}
	};
}
