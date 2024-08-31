type CubicBezierEasingKeywordValue = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
type StepEasingKeywordValue = 'step-start' | 'step-end';
type EasingKeywordValue = 'linear' | CubicBezierEasingKeywordValue | StepEasingKeywordValue;
/**
 * `data-easing` attribute
 */
export default class {
    #private;
    /**
     * @param value - Attribute value
     */
    constructor(value: string | null | undefined);
    get value(): EasingKeywordValue | undefined;
}
export {};
//# sourceMappingURL=Easing.d.ts.map