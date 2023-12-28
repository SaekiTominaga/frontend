/**
 * Send referrer error information to endpoints
 */
export default class {
    #endpoint; // URL of the endpoint
    #options; // Information such as transmission conditions
    /**
     * @param endpoint - URL of the endpoint
     * @param options - Information such as transmission conditions
     */
    constructor(endpoint, options) {
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
    async report() {
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
    #checkUserAgent() {
        const ua = navigator.userAgent;
        const { denyUAs, allowUAs } = this.#options;
        if (denyUAs !== undefined && denyUAs.some((denyUA) => denyUA.test(ua))) {
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
    #checkReferrer(referrerPart, locationPart) {
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
    async #fetch(referrerUrl) {
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
        const fetchBody = contentType === 'application/json' ? JSON.stringify(Object.fromEntries(formData)) : new URLSearchParams([...formData]);
        const response = await fetch(this.#endpoint, {
            method: 'POST',
            headers: fetchHeaders,
            body: fetchBody,
        });
        if (!response.ok) {
            throw new Error(`"${response.url}" is ${response.status} ${response.statusText}`);
        }
    }
}
//# sourceMappingURL=ReportSameReferrer.js.map