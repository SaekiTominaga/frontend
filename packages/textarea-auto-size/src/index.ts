import TextareaAutoSize from './TextareaAutoSize.js';

const validate = (element: Element): HTMLTextAreaElement => {
	if (!(element instanceof HTMLTextAreaElement)) {
		throw new Error('Element must be a `HTMLTextAreaElement`');
	}

	return element;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		new TextareaAutoSize(validate(elementOrElements));
	} else {
		for (const element of elementOrElements) {
			new TextareaAutoSize(validate(element));
		}
	}
};
