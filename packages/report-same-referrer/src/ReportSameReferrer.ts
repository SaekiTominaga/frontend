interface FetchParam {
	location: string; // Field name when sending `location` to an endpoint.
	referrer: string; // Field name when sending `document.referrer` to an endpoint.
}

interface Option {
	fetchParam?: FetchParam;
	fetchContentType?: 'application/x-www-form-urlencoded' | 'application/json'; // `Content-Type` header to be set in `fetch()` request.
	fetchHeaders?: HeadersInit; // Header to add to the `fetch()` request. <https://fetch.spec.whatwg.org/#typedefdef-headersinit>
	condition?: 'origin' | 'host' | 'hostname'; // Which parts of the referrer to check.
	same?: string[]; // Domain information treated as the same site.
	denyUAs?: RegExp[]; // If a user agent matches this regular expression, do not send report.
	allowUAs?: RegExp[]; // If a user agent matches this regular expression, send report.
}

/**
 * Send referrer error information to endpoints
 */
export default class {
	readonly #endpoint: string; // URL of the endpoint

	readonly #options: Option; // Information such as transmission conditions

	/**
	 * @param endpoint - URL of the endpoint
	 * @param options - Information such as transmission conditions
	 */
	constructor(endpoint: string, options?: Readonly<Option>) {
		this.#endpoint = endpoint;

		this.#options = options ?? {};
		if (options?.fetchParam === undefined) {
			this.#options.fetchParam = {
				location: 'location',
				referrer: 'referrer',
			};
		}
		if (options?.condition === undefined) {
			this.#options.condition = 'origin';
		}
	}

	/**
	 * Referrer check & report
	 */
	async report(): Promise<void> {
		const { referrer } = document;
		if (referrer === '') {
			return;
		}

		if (!this.#checkUserAgent()) {
			return;
		}

		const referrerUrl = new URL(referrer);

		switch (this.#options.condition) {
			case 'origin': {
				if (!this.#checkReferrer(referrerUrl.origin, location.origin)) {
					return;
				}
				break;
			}
			case 'host': {
				if (!this.#checkReferrer(referrerUrl.host, location.host)) {
					return;
				}
				break;
			}
			case 'hostname': {
				if (!this.#checkReferrer(referrerUrl.hostname, location.hostname)) {
					return;
				}
				break;
			}
			default:
				throw new Error('An invalid value was specified for the argument `condition`.');
		}

		await this.#fetch(referrerUrl);
	}

	/**
	 * ユーザーエージェントがレポートを行う対象かどうかチェックする
	 *
	 * @returns 対象なら true
	 */
	#checkUserAgent(): boolean {
		const ua = navigator.userAgent;

		const { denyUAs, allowUAs } = this.#options;
		if (denyUAs?.some((denyUA) => denyUA.test(ua))) {
			console.info('No referrer error report will be sent because the user agent match the deny list.');
			return false;
		}
		if (allowUAs !== undefined && !allowUAs.some((allowUA) => allowUA.test(ua))) {
			console.info('No referrer error report will be sent because the user agent does not match the allow list.');
			return false;
		}

		return true;
	}

	/**
	 * リファラーがレポートを行う対象かどうかチェックする
	 *
	 * @param referrerPart - リファラーの一部分
	 * @param locationPart - Location の一部分
	 *
	 * @returns 対象なら true
	 */
	#checkReferrer(referrerPart: string, locationPart: string): boolean {
		const { same } = this.#options;
		if (same?.includes(referrerPart)) {
			return true;
		}

		return referrerPart === locationPart;
	}

	/**
	 * レポートを送信
	 *
	 * @param referrerUrl - リファラーのURL
	 */
	async #fetch(referrerUrl: URL): Promise<void> {
		const { fetchParam } = this.#options;
		if (fetchParam === undefined) {
			throw new Error('Option `fetchParam` is undefined.');
		}

		const formData = new FormData();
		formData.append(fetchParam.location, location.toString());
		formData.append(fetchParam.referrer, referrerUrl.toString());

		const contentType = this.#options.fetchContentType;

		const fetchHeaders = new Headers(this.#options.fetchHeaders);
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
			throw new Error(`"${response.url}" is ${String(response.status)} ${response.statusText}`);
		}
	}
}
