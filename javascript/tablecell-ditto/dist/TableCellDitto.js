import { init as textMetrics } from 'text-metrics';
/**
 * Display the data cell with the same content as the cell directly above in `<tbody>` with a ditto mark
 */
export default class {
    #thisElement; // 対象要素
    #col; // 表の列数
    #dittoMark; // ノノ字点
    #dittoMarkWidth = 0; // ノノ字点の幅
    #cellSelector; // セル（<th>, <td> 要素）のセレクター
    /**
     * @param thisElement - Target element
     * @param options - Options
     * @param options.mark - Ditto mark (default: '"')
     * @param options.th - Whether <th> elements are to be converted or not (default: false)
     */
    constructor(thisElement, options) {
        this.#thisElement = thisElement;
        this.#dittoMark = options?.mark ?? '"';
        this.#cellSelector = options?.th ?? false ? ':is(th, td)' : 'td';
        const firstRowCellElements = thisElement
            .querySelector(':scope > tbody')
            ?.querySelectorAll(`:scope > tr:first-child > ${this.#cellSelector}`); // 表の列数
        if (firstRowCellElements === undefined) {
            throw new Error('Table body cell does not exist in the specified table.');
        }
        this.#col = firstRowCellElements.length;
        if (firstRowCellElements.length > 0) {
            const metrics = textMetrics(firstRowCellElements.item(0));
            this.#dittoMarkWidth = metrics.width(this.#dittoMark);
        }
    }
    /**
     * Replace with ditto mark
     */
    convert() {
        this.#thisElement.querySelectorAll(':scope > tbody').forEach((tbodyElement) => {
            const aboveCellText = new Array(this.#col); // 直上行のセルの中身
            const aboveRowspans = new Array(this.#col); //
            tbodyElement.querySelectorAll(':scope > tr').forEach((trElement, trIndex) => {
                let skip = 0;
                const tdElements = trElement.querySelectorAll(`:scope > ${this.#cellSelector}`);
                tdElements.forEach((tdElement, tdIndex) => {
                    const text = tdElement.textContent?.trim();
                    let colIndex = tdIndex + skip;
                    let aboveRowspan = aboveRowspans[colIndex];
                    while (aboveRowspan !== undefined && aboveRowspan > 1) {
                        aboveRowspans[colIndex] -= 1;
                        skip += 1;
                        colIndex += 1;
                        aboveRowspan = aboveRowspans[colIndex];
                    }
                    const rowspan = tdElement.rowSpan;
                    aboveRowspans[colIndex] = rowspan;
                    if (trIndex >= 1 && text !== undefined && text !== '' && text === aboveCellText[colIndex]) {
                        /* 表示位置調整 */
                        switch (getComputedStyle(tdElement, '').textAlign) {
                            case 'start': {
                                const metrics = textMetrics(tdElement);
                                const paddingStart = getComputedStyle(tdElement).paddingInlineStart;
                                tdElement.style.paddingInlineStart = `calc((${String(Math.round(metrics.width(text)))}px - ${this.#dittoMarkWidth}px) / 2 + ${paddingStart})`;
                                break;
                            }
                            case 'end': {
                                const metrics = textMetrics(tdElement);
                                const paddingEnd = getComputedStyle(tdElement).paddingInlineEnd;
                                tdElement.style.paddingInlineEnd = `calc((${String(Math.round(metrics.width(text)))}px - ${this.#dittoMarkWidth}px) / 2 + ${paddingEnd})`;
                                break;
                            }
                            default:
                        }
                        /* テキスト変換 */
                        tdElement.title = text;
                        tdElement.textContent = this.#dittoMark;
                    }
                    aboveCellText[colIndex] = text ?? '';
                });
                for (let colIndex = tdElements.length + skip; colIndex < this.#col; colIndex += 1) {
                    aboveRowspans[colIndex] -= 1;
                }
            });
        });
    }
    /**
     * Stop replacing with ditto mark
     */
    unConvert() {
        this.#thisElement.querySelectorAll(`:scope > tbody > tr > ${this.#cellSelector}`).forEach((tdElement) => {
            const text = tdElement.textContent;
            if (text !== null && text === this.#dittoMark) {
                /* 表示位置戻す */
                switch (getComputedStyle(tdElement, '').textAlign) {
                    case 'start': {
                        tdElement.style.paddingInlineStart = '';
                        break;
                    }
                    case 'end': {
                        tdElement.style.paddingInlineEnd = '';
                        break;
                    }
                    default:
                }
                /* テキスト戻す */
                tdElement.textContent = tdElement.title;
                tdElement.removeAttribute('title');
            }
        });
    }
}
//# sourceMappingURL=TableCellDitto.js.map