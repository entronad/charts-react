// A measurement result for rendering text.
export class TextMeasurement {
  // Rendered width of the text.
  readonly horizontalSliceWidth: number;

  // Vertical slice is likely based off the rendered text.
  //
  // This means that 'mo' and 'My' will have different heights so do not use
  // this for centering vertical text.
  readonly verticalSliceWidth: number;

  // Baseline of the text for text vertical alignment.
  readonly baseline: number;

  constructor({
    horizontalSliceWidth,
    verticalSliceWidth,
    baseline,
  }: {
    horizontalSliceWidth?: number,
    verticalSliceWidth?: number,
    baseline?: number,
  } = {}) {
    this.horizontalSliceWidth = horizontalSliceWidth;
    this.verticalSliceWidth = verticalSliceWidth;
    this.baseline = baseline;
  }
}
