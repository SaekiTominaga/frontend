type CubicBezierEasingKeyword = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
type StepEasingKeyword = 'step-start' | 'step-end';
type EasingKeyword = 'linear' | CubicBezierEasingKeyword | StepEasingKeyword;
/**
 * `easing` value
 */
export default class {
    #private;
    /**
     * @param value - Attribute value
     */
    constructor(value: string | null);
    get value(): EasingKeyword | undefined;
}
export {};
//# sourceMappingURL=Easing.d.ts.map