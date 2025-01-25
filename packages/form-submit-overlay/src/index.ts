import FormSubmitOverlay from './FormSubmitOverlay.js';

const validate = (element: Element): HTMLFormElement => {
	if (!(element instanceof HTMLFormElement)) {
		throw new Error('Element must be a `HTMLFormElement`');
	}

	return element;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		new FormSubmitOverlay(validate(elementOrElements));
	} else {
		for (const element of elementOrElements) {
			new FormSubmitOverlay(validate(element));
		}
	}
};
