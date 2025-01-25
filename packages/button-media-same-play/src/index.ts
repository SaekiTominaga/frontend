import ButtonMediaSamePlay from './ButtonMediaSamePlay.js';

const validate = (element: Element): HTMLButtonElement => {
	if (!(element instanceof HTMLButtonElement)) {
		throw new Error('Element must be a `HTMLButtonElement`');
	}

	return element;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		new ButtonMediaSamePlay(validate(elementOrElements));
	} else {
		for (const element of elementOrElements) {
			new ButtonMediaSamePlay(validate(element));
		}
	}
};
