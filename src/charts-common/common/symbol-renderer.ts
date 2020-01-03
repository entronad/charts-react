import { Rectangle, Point } from 'package:dart/math';

import { ChartCanvas } from '../chart/common/chart-canvas';
import { Color } from './color';
import { StyleFactory } from './style/style-factory'

// Strategy for rendering a symbol.
export abstract class BaseSymbolRenderer {
  abstract shouldRepaint(oldRenderer: BaseSymbolRenderer): boolean;
}

// Strategy for rendering a symbol bounded within a box.
export abstract class SymbolRenderer extends BaseSymbolRenderer {
  // Whether the symbol should be rendered as a solid shape, or a hollow shape.
  //
  // If this is true, then fillColor and strokeColor will be used to fill in
  // the shape, and draw a border, respectively. The stroke (border) will only
  // be visible if a non-zero strokeWidthPx is configured.
  //
  // If this is false, then the shape will be filled in with a white color
  // (overriding fillColor). strokeWidthPx will default to 2 if none was
  // configured.
  readonly isSolid: boolean;

  constructor({ isSolid }: { isSolid?: boolean } = {}) {
    super();
    this.isSolid = isSolid;
  }

  abstract paint(canvas: ChartCanvas, bounds: Rectangle, {
    dashPattern,
    fillColor,
    strokeColor,
    strokeWidthPx,
  }: {
    dashPattern?: Array<number>,
    fillColor?: Color,
    strokeColor?: Color,
    strokeWidthPx?: number,
  }): void;

  getSolidStrokeWidthPx = (strokeWidthPx: number) =>
    this.isSolid ? strokeWidthPx : strokeWidthPx ?? 2.0;

  getSolidFillColor = (fillColor: Color) =>
    this.isSolid ? fillColor : StyleFactory.style.white;

  equals = (other: any) =>
    (other instanceof SymbolRenderer && other.isSolid === this.isSolid);
}

// Strategy for rendering a symbol centered around a point.
//
// An optional second point can describe an extended symbol.
export abstract class PointSymbolRenderer extends BaseSymbolRenderer {
  abstract paint(canvas: ChartCanvas, p1: Point, radius: number, {
    p2,
    fillColor,
    strokeColor,
  }: {
    p2?: Point,
    fillColor: Color,
    strokeColor: Color,
  }): void;
}

// Rounded rectangular symbol with corners having [radius].
export class RoundedRectSymbolRenderer extends SymbolRenderer {
  readonly radius: number;

  constructor({
    isSolid = true,
    radius,
  }: {
    isSolid?: boolean,
    radius?: number,
  } = {}) {
    super({ isSolid });
    this.radius = radius ?? 1.0;
  }

  paint = (canvas: ChartCanvas, bounds: Rectangle, {
    // dashPattern,
    fillColor,
    strokeColor,
    // strokeWidthPx,
  }: {
    dashPattern?: Array<number>,
    fillColor?: Color,
    strokeColor?: Color,
    strokeWidthPx?: number,
  } = {}) => {
    canvas.drawRRect(bounds, {
      fill: this.getSolidFillColor(fillColor),
      stroke: strokeColor,
      radius: this.radius,
      roundTopLeft: true,
      roundTopRight: true,
      roundBottomRight: true,
      roundBottomLeft: true,
    });
  };

  shouldRepaint = (oldRenderer: RoundedRectSymbolRenderer) =>
    !this.equals(oldRenderer);
  
  equals = (other: any) =>
    (other instanceof RoundedRectSymbolRenderer &&
    other.radius === this.radius &&
    super.equals.call(this));
}

// Line symbol renderer.
export class LineSymbolRenderer extends SymbolRenderer {
  static readonly roundEndCapsPixels = 2;
  static readonly minLengthToRoundCaps = (LineSymbolRenderer.roundEndCapsPixels * 2) + 1;
  static readonly strokeWidthForRoundEndCaps = 4.0;
  static readonly strokeWidthForNonRoundedEndCaps = 2.0;

  // Thickness of the line stroke.
  readonly strokeWidth: number;

  // Dash pattern for the line.
  readonly _dashPattern: Array<number>;

  constructor({
    dashPattern,
    isSolid = true,
    strokeWidth,
  }: {
    dashPattern?: Array<number>,
    isSolid?: boolean,
    strokeWidth?: number,
  } = {}) {
    super({ isSolid });
    this.strokeWidth = strokeWidth ?? LineSymbolRenderer.strokeWidthForRoundEndCaps;
    this._dashPattern = dashPattern;
  }

  paint = (canvas: ChartCanvas, bounds: Rectangle, {
    dashPattern,
    fillColor,
    strokeColor,
    strokeWidthPx,
  }: {
    dashPattern?: Array<number>,
    fillColor?: Color,
    strokeColor?: Color,
    strokeWidthPx?: number,
  } = {}) => {
    const centerHeight = (bounds.bottom - bounds.top) / 2;

    // If we have a dash pattern, do not round the end caps, and set
    // strokeWidthPx to a smaller value. Using round end caps makes smaller
    // patterns blurry.
    const localDashPattern = dashPattern ?? this._dashPattern;
    const roundEndCaps = localDashPattern == null;

    // If we have a dash pattern, the normal stroke width makes them look
    // strangely tall.
    const localStrokeWidthPx = localDashPattern == null
      ? this.getSolidStrokeWidthPx(strokeWidthPx ?? this.strokeWidth)
      : LineSymbolRenderer.strokeWidthForRoundEndCaps;

    // Adjust the length so the total width includes the rounded pixels.
    // Otherwise the cap is drawn past the bounds and appears to be cut off.
    // If bounds is not long enough to accommodate the line, do not adjust.
    let { left, right } = bounds;

    if (roundEndCaps && bounds.width >= LineSymbolRenderer.minLengthToRoundCaps) {
      left += LineSymbolRenderer.roundEndCapsPixels;
      right -= LineSymbolRenderer.roundEndCapsPixels;
    }

    // TODO: Pass in strokeWidth, roundEndCaps, and dashPattern from
    // line renderer config.
    canvas.drawLine({
      points: [new Point(left, centerHeight), new Point(right, centerHeight)],
      dashPattern: localDashPattern,
      fill: this.getSolidFillColor(fillColor),
      roundEndCaps,
      stroke: strokeColor,
      strokeWidthPx: localStrokeWidthPx,
    });
  };

  shouldRepaint = (oldRenderer: LineSymbolRenderer) =>
    !this.equals(oldRenderer);

  equals = (other: any) =>
    (other instanceof LineSymbolRenderer &&
    other.strokeWidth === this.strokeWidth &&
    super.equals.call(this));
}

// Circle symbol renderer.
export class CircleSymbolRenderer extends SymbolRenderer {
  constructor({ isSolid = true }: { isSolid?: boolean } = {}) {
    super({ isSolid });
  }

  paint = (canvas: ChartCanvas, bounds: Rectangle, {
    // dashPattern,
    fillColor,
    strokeColor,
    strokeWidthPx,
  }: {
    dashPattern?: Array<number>,
    fillColor?: Color,
    strokeColor?: Color,
    strokeWidthPx?: number,
  } = {}) => {
    const center = new Point(
      bounds.left + (bounds.width / 2),
      bounds.top + (bounds.height / 2),
    );
    const radius = Math.min(bounds.width, bounds.height) / 2;
    canvas.drawPoint({
      point: center,
      radius,
      fill: this.getSolidFillColor(fillColor),
      stroke: strokeColor,
      strokeWidthPx: this.getSolidStrokeWidthPx(strokeWidthPx),
    });
  };

  shouldRepaint = (oldRenderer: CircleSymbolRenderer) =>
    !this.equals(oldRenderer);
  
  equals = (other: any) =>
    (other instanceof CircleSymbolRenderer &&
    super.equals.call(this));
}

// Rectangle symbol renderer.
export class RectSymbolRenderer extends SymbolRenderer {
  constructor({ isSolid = true }: { isSolid?: boolean } = {}) {
    super({ isSolid });
  }

  paint = (canvas: ChartCanvas, bounds: Rectangle, {
    // dashPattern,
    fillColor,
    strokeColor,
    strokeWidthPx,
  }: {
    dashPattern?: Array<number>,
    fillColor?: Color,
    strokeColor?: Color,
    strokeWidthPx?: number,
  } = {}) => {
    canvas.drawRect(bounds, {
      fill: this.getSolidFillColor(fillColor),
      stroke: strokeColor,
      strokeWidthPx: this.getSolidStrokeWidthPx(strokeWidthPx),
    });
  };

  shouldRepaint = (oldRenderer: RectSymbolRenderer) =>
    !this.equals(oldRenderer);
  
  equals = (other: any) =>
    (other instanceof RectSymbolRenderer &&
    super.equals.call(this));
}

// Draws a cylindrical shape connecting two points.
export class CylinderSymbolRenderer extends PointSymbolRenderer {
  paint = (canvas: ChartCanvas, p1: Point, radius: number, {
    p2,
    // fillColor,
    strokeColor,
  }: {
    p2?: Point,
    fillColor: Color,
    strokeColor: Color,
  }) => {
    if (p1 == null) {
      throw new Error(`Invalid point p1 "${p1}"`);
    }

    if (p2 == null) {
      throw new Error(`Invalid point p1 "${p2}"`);
    }

    const adjustedP1 = new Point(p1.x, p1.y);
    const adjustedP2 = new Point(p2.x, p2.y);

    canvas.drawLine({
      points: [adjustedP1, adjustedP2],
      stroke: strokeColor,
      roundEndCaps: true,
      strokeWidthPx: radius * 2,
    });
  };

  shouldRepaint = (oldRenderer: CylinderSymbolRenderer) =>
    !this.equals(oldRenderer);
  
  equals = (other: any) => other instanceof CylinderSymbolRenderer;
}

// Draws a rectangular shape connecting two points.
export class RectangleRangeSymbolRenderer extends PointSymbolRenderer {
  paint = (canvas: ChartCanvas, p1: Point, radius: number, {
    p2,
    // fillColor,
    strokeColor,
  }: {
    p2?: Point,
    fillColor: Color,
    strokeColor: Color,
  }) => {
    if (p1 == null) {
      throw new Error(`Invalid point p1 "${p1}"`);
    }

    if (p2 == null) {
      throw new Error(`Invalid point p1 "${p2}"`);
    }

    const adjustedP1 = new Point(p1.x, p1.y);
    const adjustedP2 = new Point(p2.x, p2.y);

    canvas.drawLine({
      points: [adjustedP1, adjustedP2],
      stroke: strokeColor,
      roundEndCaps: false,
      strokeWidthPx: radius * 2,
    });
  };

  shouldRepaint = (oldRenderer: RectangleRangeSymbolRenderer) =>
    !this.equals(oldRenderer);
  
  equals = (other: any) => other instanceof RectangleRangeSymbolRenderer;
}
