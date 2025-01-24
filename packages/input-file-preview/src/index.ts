import InputFilePreview from './InputFilePreview.js';

const validate = (element: Element): HTMLInputElement => {
	if (!(element instanceof HTMLInputElement)) {
		throw new Error('Element must be a `HTMLInputElement`');
	}

	return element;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		new InputFilePreview(validate(elementOrElements));
	} else {
		for (const element of elementOrElements) {
			new InputFilePreview(validate(element));
		}
	}
};
