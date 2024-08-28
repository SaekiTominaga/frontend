type CubicBezierEasingKeyword = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
type StepEasingKeyword = 'step-start' | 'step-end';
type EasingKeyword = 'linear' | CubicBezierEasingKeyword | StepEasingKeyword;

/**
 * `easing` value
 */
export default class {
	readonly #value: EasingKeyword | undefined;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null) {
		if (value === null) {
			return;
		}

		if (!['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier', 'step-start', 'step-end', 'steps'].includes(value)) {
			throw new TypeError(
				'The `easing` value must be an "linear", "ease", "ease-in", "ease-out", "ease-in-out", "cubic-bezier", "step-start", "step-end", or "steps".',
			);
		}

		this.#value = value as EasingKeyword;
	}

	get value(): EasingKeyword | undefined {
		return this.#value;
	}
}
