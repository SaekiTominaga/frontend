import MIMEType from 'whatwg-mimetype';
import ErrorMessage from './ErrorMessage.js';
/**
 * Show preview with `<input type=file>`
 */
export default class {
    #inputFileElement;
    #previewTemplateElement; // プレビューを表示するテンプレート
    #previewElements = new Set(); // プレビューを表示する要素
    #errorHTML; // エラーメッセージ
    #maxSize = 10485760; // これ以上のサイズのファイルはプレビューを行わない
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
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
        this.#previewTemplateElement = previewElement;
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
    #changeEvent = () => {
        const { files } = this.#inputFileElement;
        /* 既存のプレビューをリセット */
        this.#previewElements.forEach((element) => {
            element.remove();
        });
        const fragment = document.createDocumentFragment();
        Array.from(files).forEach((file) => {
            const templateElementClone = this.#previewTemplateElement.content.cloneNode(true);
            const outputElement = templateElementClone.querySelector('output');
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
            fileReader.addEventListener('load', () => {
                const fileReaderResult = fileReader.result;
                if (fileReaderResult === null) {
                    throw new Error('File load failed.');
                }
                let mediaElement;
                switch (type) {
                    case 'image': {
                        mediaElement = document.createElement('img');
                        mediaElement.src = fileReaderResult;
                        mediaElement.alt = fileName;
                        break;
                    }
                    case 'audio': {
                        mediaElement = document.createElement('audio');
                        mediaElement.src = fileReaderResult;
                        mediaElement.controls = true;
                        mediaElement.textContent = fileName;
                        break;
                    }
                    case 'video': {
                        mediaElement = document.createElement('video');
                        mediaElement.src = fileReaderResult;
                        mediaElement.controls = true;
                        mediaElement.textContent = fileName;
                        break;
                    }
                    default:
                }
                outputElement.appendChild(mediaElement);
            });
        });
        let count = fragment.childElementCount;
        this.#previewTemplateElement.parentNode?.insertBefore(fragment, this.#previewTemplateElement);
        let previousElement = this.#previewTemplateElement.previousElementSibling;
        while (count > 0) {
            this.#previewElements.add(previousElement);
            count -= 1;
            previousElement = previousElement.previousElementSibling;
        }
    };
}
//# sourceMappingURL=InputFilePreview.js.map