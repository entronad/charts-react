import { Rectangle, Point } from 'package:dart/math';

import { Color } from '../../common/color';
import { FillPatternType } from './chart-canvas';

/// A rectangle to be painted by [ChartCanvas].
export class CanvasRect {
  readonly bounds: Rectangle;
  readonly dashPattern: Array<number>;
  readonly fill: Color;
  readonly pattern: FillPatternType;
  readonly stroke: Color;
  readonly strokeWidthPx: number;

  constructor(bounds: Rectangle, {
    dashPattern,
    fill,
    pattern,
    stroke,
    strokeWidthPx,
  }: {
    dashPattern?: Array<number>,
    fill?: Color,
    pattern?: FillPatternType,
    stroke?: Color,
    strokeWidthPx?: number, 
  }) {
    this.bounds = bounds;
    this.dashPattern = dashPattern;
    this.fill = fill;
    this.pattern = pattern;
    this.stroke = stroke;
    this.strokeWidthPx = strokeWidthPx;
  }
}

/// A stack of [CanvasRect] to be painted by [ChartCanvas].
class CanvasBarStack {
  readonly segments: Array<CanvasRect>;
  readonly radius: number;
  readonly stackedBarPadding: number;
  readonly roundTopLeft: boolean;
  readonly roundTopRight: boolean;
  readonly roundBottomLeft: boolean;
  readonly roundBottomRight: boolean;
  readonly fullStackRect: Rectangle;

  constructor(segments: Array<CanvasRect>, {
    radius,
    stackedBarPadding,
    roundTopLeft,
    roundTopRight,
    roundBottomLeft,
    roundBottomRight,
  }: {
    radius?: number;
    stackedBarPadding?: number;
    roundTopLeft?: boolean;
    roundTopRight?: boolean;
    roundBottomLeft?: boolean;
    roundBottomRight?: boolean;
    fullStackRect?: Rectangle;
  }) {
    const firstBarBounds = segments[0].bounds;

    // Find the rectangle that would represent the full stack of bars.
    let { left, top, right, bottom } = firstBarBounds;

    for (let barIndex = 1; barIndex < segments.length; barIndex++) {
      const { bounds } = segments[barIndex];
      
      left = Math.min(left, bounds.left);
      top = Math.min(top, bounds.top);
      right = Math.max(right, bounds.right);
      bottom = Math.max(bottom, bounds.bottom);
    }

    const width = right - left;
    const height = bottom - top;
    const fallStackRect = new Rectangle(left, top, width, height);
  }
}


