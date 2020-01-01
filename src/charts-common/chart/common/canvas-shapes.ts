import { Rectangle, Point } from 'package:dart/math';

import { Color } from '../../common/color';
import { FillPatternType } from './chart-canvas';

// A rectangle to be painted by [ChartCanvas].
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
  } = {}) {
    this.bounds = bounds;
    this.dashPattern = dashPattern;
    this.fill = fill;
    this.pattern = pattern;
    this.stroke = stroke;
    this.strokeWidthPx = strokeWidthPx;
  }
}

// A stack of [CanvasRect] to be painted by [ChartCanvas].
export class CanvasBarStack {
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
    stackedBarPadding = 1,
    roundTopLeft = false,
    roundTopRight = false,
    roundBottomLeft = false,
    roundBottomRight = false,
  }: {
    radius?: number;
    stackedBarPadding?: number;
    roundTopLeft?: boolean;
    roundTopRight?: boolean;
    roundBottomLeft?: boolean;
    roundBottomRight?: boolean;
  } = {}) {
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
    const fullStackRect = new Rectangle(left, top, width, height);

    this.segments = segments;
    this.radius = radius;
    this.stackedBarPadding = stackedBarPadding;
    this.roundTopLeft = roundTopLeft;
    this.roundTopRight = roundTopRight;
    this.roundBottomLeft = roundBottomLeft;
    this.roundBottomRight = roundBottomRight;
    this.fullStackRect = fullStackRect;
  }
}

// A list of [CanvasPieSlice]s to be painted by [ChartCanvas].
export class CanvasPie {
  readonly slices: Array<CanvasPieSlice>;
  center: Point;
  radius: number;
  innerRadius: number;

  // Color of separator lines between arcs.
  readonly stroke: Color;

  // Stroke width of separator lines between arcs.
  strokeWidthPx: number;
}

// A circle sector to be painted by [ChartCanvas].
export class CanvasPieSlice {
  startAngle: number;
  endAngle: number;
  fill: Color;

  constructor(
    startAngle: number,
    endAngle: number,
    { fill }: { fill?: Color } = {},
  ) {
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.fill = fill;
  }
}
