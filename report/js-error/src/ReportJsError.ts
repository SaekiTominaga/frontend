interface FetchParam {
	location: string; // Field name when sending `location` to an endpoint.
	message: string; // Field name when sending `ErrorEvent.message` to an endpoint.
	filename: string; // Field name when sending `ErrorEvent.filename` to an endpoint.
	lineno: string; // Field name when sending `ErrorEvent.lineno` to an endpoint.
	colno: string; // Field name when sending `ErrorEvent.colno` to an endpoint.
}

interface Option {
	fetchParam?: FetchParam;
	fetchContentType?: 'application/x-www-form-urlencoded' | 'application/json';
	fetchHeaders?: HeadersInit; // Header to add to the `fetch()` request. <https://fetch.spec.whatwg.org/#typedefdef-headersinit>
	denyFilenames?: RegExp[]; // If the script filename (`ErrorEvent.filename`) matches this regular expression, do not send report
	allowFilenames?: RegExp[]; // If the script filename (`ErrorEvent.filename`) matches this regular expression, send report
	denyUAs?: RegExp[]; // If a user agent matches this regular expression, do not send report
	allowUAs?: RegExp[]; // If a user agent matches this regular expression, send report
}

/**
 * Send script error information to endpoints
 */
export default class {
	readonly #endpoint: string; // URL of the endpoint

	readonly #option: Option; // Information such as transmission conditions

	readonly #errorEventListener: (ev: ErrorEvent) => void;

	/**
	 * @param endpoint - URL of the endpoint
	 * @param option - Information such as transmission conditions
	 */
	constructor(endpoint: string, option: Option = {}) {
		this.#endpoint = endpoint;

		if (option.fetchParam === undefined) {
			option.fetchParam = {
				location: 'location',
				message: 'message',
				filename: 'filename',
				lineno: 'lineno',
				colno: 'colno',
			};
		}
		this.#option = option;

		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this.#errorEventListener = this.#errorEvent.bind(this);
	}

	/**
	 * Initial processing
	 */
	init(): void {
		if (!this.#checkUserAgent()) {
			return;
		}

		window.addEventListener('error', this.#errorEventListener, { passive: true });
	}

	/**
	 * ユーザーエージェントがレポートを行う対象かどうかチェックする
	 *
	 * @returns 対象なら true
	 */
	#checkUserAgent(): boolean {
		const ua = navigator.userAgent;

		const { denyUAs, allowUAs } = this.#option;
		if (denyUAs !== undefined && denyUAs.some((denyUA) => denyUA.test(ua))) {
			console.info('No JavaScript error report will be sent because the user agent match the deny list.');
			return false;
		}
		if (allowUAs !== undefined && !allowUAs.some((allowUA) => allowUA.test(ua))) {
			console.info('No JavaScript error report will be sent because the user agent does not match the allow list.');
			return false;
		}

		return true;
	}

	/**
	 * エラー情報をエンドポイントに送信する
	 *
	 * @param ev - ErrorEvent
	 */
	async #errorEvent(ev: ErrorEvent): Promise<void> {
		const { message, filename, lineno, colno } = ev;

		if (filename === '') {
			// 2020年11月現在、「YJApp-ANDROID jp.co.yahoo.android.yjtop/3.81.0」と名乗るブラウザがこのような挙動を行う（fillename === '' && lineno === 0 && colno === 0）
			console.error('`ErrorEvent.filename` is empty.');
			return;
		}

		const { denyFilenames, allowFilenames } = this.#option;
		if (denyFilenames !== undefined && denyFilenames.some((denyFilename) => denyFilename.test(filename))) {
			console.info('No JavaScript error report will be sent because the filename match the deny list.');
			return;
		}
		if (allowFilenames !== undefined && !allowFilenames.some((allowFilename) => allowFilename.test(filename))) {
			console.info('No JavaScript error report will be sent because the filename does not match the allow list.');
			return;
		}

		switch (new URL(filename).protocol) {
			case 'https:':
			case 'http:':
				break;
			default:
				console.error('A JavaScript error has occurred in a non-HTTP protocol (This may be due to a browser extension).');
				return;
		}

		const { fetchParam } = this.#option;
		if (fetchParam === undefined) {
			throw new Error('Option `fetchParam` is undefined.');
		}

		const formData = new FormData();
		formData.append(fetchParam.location, location.toString());
		formData.append(fetchParam.message, message);
		formData.append(fetchParam.filename, filename);
		formData.append(fetchParam.lineno, String(lineno));
		formData.append(fetchParam.colno, String(colno));

		const contentType = this.#option.fetchContentType;

		const fetchHeaders = new Headers(this.#option.fetchHeaders);
		if (contentType !== undefined) {
			fetchHeaders.set('Content-Type', contentType);
		}

		const fetchBody: BodyInit =
			contentType === 'application/json' ? JSON.stringify(Object.fromEntries(formData)) : new URLSearchParams([...formData] as string[][]);

		const response = await fetch(this.#endpoint, {
			method: 'POST',
			headers: fetchHeaders,
			body: fetchBody,
		});

		if (!response.ok) {
			console.error(`"${response.url}" is ${response.status} ${response.statusText}`);
		}
	}
}
