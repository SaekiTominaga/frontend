import ReportSameReferrer, { type Option } from './ReportSameReferrer.js';

export default async (endpoint: string, options?: Readonly<Option>): Promise<void> => {
	const reportSameReferrer = new ReportSameReferrer(endpoint, options);
	await reportSameReferrer.report();
};
