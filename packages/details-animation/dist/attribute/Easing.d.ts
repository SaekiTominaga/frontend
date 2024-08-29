type CubicBezierEasingKeywordValue = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
type StepEasingKeywordValue = 'step-start' | 'step-end';
type EasingKeywordValue = 'linear' | CubicBezierEasingKeywordValue | StepEasingKeywordValue;
/**
 * `easing` value
 */
export default class {
    #private;
    /**
     * @param value - Attribute value
     */
    constructor(value: string | null);
    get value(): EasingKeywordValue | undefined;
}
export {};
//# sourceMappingURL=Easing.d.ts.map