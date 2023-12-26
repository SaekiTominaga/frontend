interface ShadowRoot extends DocumentFragment, DocumentOrShadowRoot, InnerHTML {
	adoptedStyleSheets: CSSStyleSheet[];
}

interface CSSStyleSheet extends StyleSheet {
	replaceSync(style: string): void;
}

/* <portal> */
interface PortalHost {
	postMessage(message: any, options?: StructuredSerializeOptions): undefined;

	onmessage: any;
	onmessageerror: any;
}

interface HTMLPortalElement extends HTMLElement {
	src: string;
	referrerPolicy: string;

	activate(options?: PortalActivateOptions): Promise<undefined>;
	postMessage(message: any, options?: StructuredSerializeOptions): undefined;

	onmessage: any;
	onmessageerror: any;
}

declare const HTMLPortalElement: {
	prototype: HTMLPortalElement;
	new (): HTMLPortalElement;
};

interface PortalActivateOptions {
	data: any;
}

interface HTMLElementTagNameMap {
	portal: HTMLPortalElement;
}
