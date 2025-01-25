import ReportJsError, { type Option } from './ReportJsError.js';

export default (endpoint: string, options: Readonly<Option>): void => {
	new ReportJsError(endpoint, options);
};
