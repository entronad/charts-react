import { PaintStyle } from './paint-style';

export abstract class LineStyle extends PaintStyle {
  abstract get dashPattern(): Array<number>;
  abstract set dashPattern(dashPattern: Array<number>);

  abstract get strokeWidth(): number;
  abstract set strokeWidth(strokeWidth: number);
}
