import MIMEType from 'whatwg-mimetype';
import ErrorMessage from './ErrorMessage.js';

/**
 * Show preview with `<input type=file>`
 */
export default class {
	readonly #inputFileElement: HTMLInputElement;

	readonly #previewTemplateElement: HTMLTemplateElement; // プレビューを表示するテンプレート

	readonly #previewElements = new Set<Element>(); // プレビューを表示する要素

	readonly #errorHTML: string; // エラーメッセージ

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

		const { preview: previewElementId, maxSize } = thisElement.dataset;

		if (previewElementId === undefined) {
			throw new Error('Attribute: `data-preview` is not set.');
		}

		const previewElement = document.getElementById(previewElementId);
		if (previewElement === null) {
			throw new Error(`Element: #${previewElementId} can not found.`);
		}
		if (!('content' in previewElement)) {
			throw new Error(`Element: #${previewElementId} must be a \`<template>\` element.`);
		}
		this.#previewTemplateElement = previewElement as HTMLTemplateElement;

		const outputElement = this.#previewTemplateElement.content.querySelector('output');
		if (outputElement === null) {
			throw new Error('There must be one `<output>` element within the `<template>` element.');
		}
		this.#errorHTML = outputElement.innerHTML;

		if (maxSize !== undefined) {
			this.#maxSize = Number(maxSize);
		}

		thisElement.addEventListener('change', this.#changeEvent, { passive: true });
	}

	/**
	 * ファイル選択時の処理
	 */
	#changeEvent = (): void => {
		const { files } = this.#inputFileElement;

		/* 既存のプレビューをリセット */
		this.#previewElements.forEach((element): void => {
			element.remove();
		});

		const fragment = document.createDocumentFragment();

		Array.from(files!).forEach((file): void => {
			const templateElementClone = this.#previewTemplateElement.content.cloneNode(true) as DocumentFragment;

			const outputElement = templateElementClone.querySelector('output')!;
			outputElement.replaceChildren();

			fragment.appendChild(templateElementClone);

			const { name: fileName, size: fileSize, type: fileType } = file;
			const { type } = new MIMEType(fileType);

			/* ファイルサイズ、MIME タイプのチェック */
			if (fileSize > this.#maxSize || !['image', 'audio', 'video'].includes(type)) {
				outputElement.insertAdjacentHTML('beforeend', ErrorMessage.convert(this.#errorHTML, file));
				return;
			}

			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.addEventListener('load', (): void => {
				const fileReaderResult = fileReader.result;
				if (fileReaderResult === null) {
					throw new Error('File load failed.');
				}

				let mediaElement: HTMLImageElement | HTMLAudioElement | HTMLVideoElement | undefined;
				switch (type) {
					case 'image': {
						mediaElement = document.createElement('img');
						mediaElement.src = fileReaderResult as string;
						mediaElement.alt = fileName;
						break;
					}
					case 'audio': {
						mediaElement = document.createElement('audio');
						mediaElement.src = fileReaderResult as string;
						mediaElement.controls = true;
						mediaElement.textContent = fileName;
						break;
					}
					case 'video': {
						mediaElement = document.createElement('video');
						mediaElement.src = fileReaderResult as string;
						mediaElement.controls = true;
						mediaElement.textContent = fileName;
						break;
					}
					default:
				}

				outputElement.appendChild(mediaElement!);
			});
		});

		let count = fragment.childElementCount;

		this.#previewTemplateElement.parentNode?.insertBefore(fragment, this.#previewTemplateElement);

		let previousElement = this.#previewTemplateElement.previousElementSibling!;

		while (count > 0) {
			this.#previewElements.add(previousElement);

			count -= 1;
			previousElement = previousElement.previousElementSibling!;
		}
	};
}
