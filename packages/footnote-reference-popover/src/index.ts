import FootnoteReferencePopover from './FootnoteReferencePopover.js';

const validate = (element: Element): HTMLAnchorElement => {
	if (!(element instanceof HTMLAnchorElement)) {
		throw new Error('Element must be a `HTMLAnchorElement`');
	}

	return element;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		new FootnoteReferencePopover(validate(elementOrElements));
	} else {
		for (const element of elementOrElements) {
			new FootnoteReferencePopover(validate(element));
		}
	}
};
