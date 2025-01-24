import DetailsAnimation from './DetailsAnimation.js';

const validate = (element: Element): HTMLDetailsElement => {
	if (!(element instanceof HTMLDetailsElement)) {
		throw new Error('Element must be a `HTMLDetailsElement`');
	}

	return element;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		new DetailsAnimation(validate(elementOrElements));
	} else {
		for (const element of elementOrElements) {
			new DetailsAnimation(validate(element));
		}
	}
};
