import HtmlEscape from '@w0s/html-escape';

/**
 * Error message
 */
export default class {
	/**
	 * Converting message
	 *   ${name} → File name
	 *   ${size} → File size
	 *
	 * @param message - Message before conversion
	 * @param file - File information selected with `<input type=file />`.`
	 *
	 * @returns Message after conversion
	 */
	static convert(message: string, file: File): string {
		const { name, size } = file;

		return message.replaceAll(/\$\{name\}/g, HtmlEscape.escape(name)).replaceAll(/\$\{size\}/g, String(size));
	}
}
