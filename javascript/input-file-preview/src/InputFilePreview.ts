import HtmlEscape from '@w0s/html-escape';
import MIMEType from 'whatwg-mimetype';

/**
 * Show preview with `<input type=file>`
 */
export default class InputFilePreview {
	readonly #inputFileElement: HTMLInputElement;

	readonly #previewElement: HTMLElement; // プレビューを表示する要素

	readonly #errorMessageHTML: string; // エラーメッセージの HTML 断片

	readonly #maxSize: number = 10485760; // これ以上のサイズのファイルはプレビューを行わない

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLInputElement) {
		this.#inputFileElement = thisElement;

		const { files } = thisElement;
		if (files === null) {
			throw new Error('Not a `<input type=file>`.');
		}

		const { preview, errorMessage, maxSize } = thisElement.dataset;

		if (preview === undefined) {
			throw new Error('Attribute: `data-preview` is not set.');
		}

		const previewElement = document.getElementById(preview);
		if (previewElement === null) {
			throw new Error(`Element: #${preview} can not found.`);
		}
		this.#previewElement = previewElement;

		if (errorMessage === undefined) {
			throw new Error('Attribute: `data-error-message` is not set.');
		}
		this.#errorMessageHTML = errorMessage;

		if (maxSize !== undefined) {
			this.#maxSize = Number(maxSize);
		}

		thisElement.addEventListener('change', this.#changeEvent, { passive: true });
	}

	/**
	 * ファイル選択時の処理
	 */
	#changeEvent = (): void => {
		const targetElement = this.#previewElement;

		/* いったん空にする */
		while (targetElement.firstChild !== null) {
			targetElement.firstChild.remove();
		}

		const { files } = this.#inputFileElement;
		if (files === null) {
			throw new Error('Not a `<input type=file>`.');
		}

		Array.from(files).forEach((file) => {
			const { name, size } = file;
			const { type } = new MIMEType(file.type);

			let insertPreviewElement: HTMLElement;
			switch (targetElement.tagName.toLowerCase()) {
				case 'ol':
				case 'ul': {
					const liElement = document.createElement('li');
					targetElement.appendChild(liElement);

					insertPreviewElement = liElement;
					break;
				}
				default: {
					insertPreviewElement = targetElement;
				}
			}

			/* ファイルサイズ、 MIME タイプのチェック */
			if (size > this.#maxSize || !['image', 'audio', 'video'].includes(type)) {
				insertPreviewElement.insertAdjacentHTML('beforeend', InputFilePreview.#convertMessage(this.#errorMessageHTML, file));
				return;
			}

			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.addEventListener('load', (): void => {
				const fileReaderResult = fileReader.result as string | null;

				if (fileReaderResult === null) {
					throw new Error('File load failed.');
				}

				switch (type) {
					case 'image': {
						const imageElement = document.createElement('img');
						imageElement.src = fileReaderResult;
						imageElement.alt = name;

						insertPreviewElement.appendChild(imageElement);
						break;
					}
					case 'audio': {
						const audioElement = document.createElement('audio');
						audioElement.src = fileReaderResult;
						audioElement.controls = true;
						audioElement.textContent = name;

						insertPreviewElement.appendChild(audioElement);
						break;
					}
					case 'video': {
						const videoElement = document.createElement('video');
						videoElement.src = fileReaderResult;
						videoElement.controls = true;
						videoElement.textContent = name;

						insertPreviewElement.appendChild(videoElement);
						break;
					}
					default:
				}
			});
		});
	};

	/**
	 * 画面に表示するメッセージを変換する
	 *   ${name} → ファイル名
	 *   ${size} → ファイルサイズ
	 *
	 * @param message - 変換前のメッセージ
	 * @param file - <input type="file"/> で選択されたファイル情報
	 *
	 * @returns 変換後のメッセージ
	 */
	static #convertMessage(message: string, file: File): string {
		return message.replace(/\$\{name\}/g, HtmlEscape.escape(file.name)).replace(/\$\{size\}/g, String(file.size));
	}
}
