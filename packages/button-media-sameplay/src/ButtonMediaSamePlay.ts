/**
 * Simultaneous playback button for multiple audio / video
 */
export default class {
	readonly #mediaElements: HTMLMediaElement[] = []; // 同時再生する要素

	#paused = true; // ボタンのステータス：一時停止中かどうか

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLButtonElement) {
		const ariaControls = thisElement.getAttribute('aria-controls');
		if (ariaControls === null) {
			throw new Error('Attribute: `aria-controls` is not set.');
		}

		for (const mediaElementId of ariaControls.split(' ')) {
			const mediaElement = document.getElementById(mediaElementId);
			if (mediaElement === null) {
				throw new Error(`Element: #${mediaElementId} can not found.`);
			}

			this.#mediaElements.push(mediaElement as HTMLMediaElement);
		}

		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		thisElement.addEventListener('click', this.#clickEvent, { passive: true });
	}

	/**
	 * ボタン押下時の処理
	 */
	#clickEvent = async (): Promise<void> => {
		if (this.#mediaElements.every((element) => element.ended)) {
			/* すべての動画が再生終了していたら最初から再生を始める */
			await Promise.all(
				this.#mediaElements.map(async (targetElement) => {
					targetElement.currentTime = 0;
					await targetElement.play();
				}),
			);

			this.#paused = false;
		} else {
			if (this.#paused) {
				/* 一時停止中だったらもっとも再生時間が低い動画に合わせて再生する */
				const minTime = this.#mediaElements.reduce((accumulator, currentValue) => {
					const element = accumulator.currentTime < currentValue.currentTime ? accumulator : currentValue;
					return element;
				}).currentTime; // すべての動画の中でもっとも再生時間が低いもの

				await Promise.all(
					this.#mediaElements.map(async (targetElement) => {
						targetElement.currentTime = minTime;
						await targetElement.play();
					}),
				);
			} else {
				/* 再生中だったら一時停止する */
				this.#mediaElements.forEach((targetElement) => {
					targetElement.pause();
				});
			}

			this.#paused = !this.#paused;
		}
	};
}
