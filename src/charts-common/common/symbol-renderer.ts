import { Rectangle, Point } from 'package:dart/math';

import { ChartCanvas } from '../chart/common/chart-canvas';
import { Color } from './color';
import { StyleFactory } from './style/style-factory'

/// Strategy for rendering a symbol.
export abstract class BaseSymbolRenderer {
  abstract shouldRepaint(oldRenderer: BaseSymbolRenderer): boolean;
}

/// Strategy for rendering a symbol bounded within a box.
export abstract class SymbolRenderer extends BaseSymbolRenderer {
  /// Whether the symbol should be rendered as a solid shape, or a hollow shape.
  ///
  /// If this is true, then fillColor and strokeColor will be used to fill in
  /// the shape, and draw a border, respectively. The stroke (border) will only
  /// be visible if a non-zero strokeWidthPx is configured.
  ///
  /// If this is false, then the shape will be filled in with a white color
  /// (overriding fillColor). strokeWidthPx will default to 2 if none was
  /// configured.
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
    this.isSolid ? strokeWidthPx : strokeWidthPx || 2.0;

  getSolidFillColor = (fillColor: Color) =>
    this.isSolid ? fillColor : StyleFactory.style.white;

  equal = (other: any) =>
    (other instanceof SymbolRenderer && other.isSolid === this.isSolid);
}

/// Strategy for rendering a symbol centered around a point.
///
/// An optional second point can describe an extended symbol.
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

/// Rounded rectangular symbol with corners having [radius].
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
    this.radius = radius || 1.0;
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

  shouldRepaint = (oldRenderer: BaseSymbolRenderer): boolean =>
    (this !== oldRenderer);
  
  equal = (other: any) =>
    (other instanceof RoundedRectSymbolRenderer &&
    other.radius === this.radius &&
    super.equal.call(this));
}

/// Line symbol renderer.
export class LineSymbolRenderer extends SymbolRenderer {
  static readonly roundEndCapsPixels = 2;
  static readonly minLengthToRoundCaps = (LineSymbolRenderer.roundEndCapsPixels * 2) + 1;
  static readonly strokeWidthForRoundEndCaps = 4.0;
  static readonly strokeWidthForNonRoundedEndCaps = 2.0;

  /// Thickness of the line stroke.
  readonly strokeWidth: number;

  /// Dash pattern for the line.
  readonly _dashPattern: Array<number>;

  constructor({
    dashPattern,
    isSolid = true,
    strokeWidth,
  }: {
    dashPattern?: Array<number>,
    isSolid?: boolean,
    strokeWidth: number,
  } = {}) {
    super({ isSolid });
    this.strokeWidth = strokeWidth || LineSymbolRenderer.strokeWidthForRoundEndCaps;
    this._d
  }
}
