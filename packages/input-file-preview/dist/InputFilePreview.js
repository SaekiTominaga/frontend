import MIMEType from 'whatwg-mimetype';
import ErrorMessage from './ErrorMessage.js';
import Preview from './attribute/Preview.js';
import MaxSize from './attribute/MaxSize.js';
/**
 * Show preview with `<input type=file>`
 */
export default class {
    #inputFileElement;
    #preview; // プレビューを表示するテンプレート
    #maxSize; // プレビューを行う最大サイズ
    #previewElements = new Set(); // プレビューを表示する要素
    /**
     * @param thisElement - Target element
     */
    constructor(thisElement) {
        this.#inputFileElement = thisElement;
        const { files } = thisElement;
        if (files === null) {
            throw new Error('Not a `<input type=file>`.');
        }
        const { preview: previewAttribute, maxSize: maxSizeAttribute } = thisElement.dataset;
        this.#preview = new Preview(previewAttribute);
        this.#maxSize = new MaxSize(maxSizeAttribute ?? '10485760');
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
        [...files].forEach((file) => {
            const templateElementClone = this.#preview.template.content.cloneNode(true);
            const outputElement = templateElementClone.querySelector('output');
            outputElement.replaceChildren();
            fragment.appendChild(templateElementClone);
            const { name: fileName, size: fileSize, type: fileType } = file;
            const { type } = new MIMEType(fileType);
            /* ファイルが読み込み対象であるかどうかのチェック */
            if ((this.#maxSize.value !== undefined && fileSize > this.#maxSize.value) || !['image', 'audio', 'video'].includes(type)) {
                outputElement.insertAdjacentHTML('beforeend', ErrorMessage.convert(this.#preview.outputHtml, file));
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
        this.#preview.template.parentNode?.insertBefore(fragment, this.#preview.template);
        let previousElement = this.#preview.template.previousElementSibling;
        while (count > 0) {
            this.#previewElements.add(previousElement);
            count -= 1;
            previousElement = previousElement.previousElementSibling;
        }
    };
}
//# sourceMappingURL=InputFilePreview.js.map