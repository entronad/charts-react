import { Rectangle, Point } from 'package:dart/math';

import { Color } from '../../common/color';
import { GraphicsFactory } from '../../common/graphics-factory';
import { TextElement } from '../../common/text-element';
import { CanvasBarStack, CanvasPie } from './canvas-shapes';

export abstract class ChartCanvas {
  /// Get [GraphicsFactory] for creating native graphics elements.
  abstract get graphicsFactory(): GraphicsFactory;

  /// Set the name of the view doing the rendering for debugging purposes,
  /// or null when we believe rendering is complete.
  abstract set drawingView(viewName: string);

  /// Renders a sector of a circle, with an optional hole in the center.
  ///
  /// [center] The x, y coordinates of the circle's center.
  /// [radius] The radius of the circle.
  /// [innerRadius] Optional radius of a hole in the center of the circle that
  ///     should not be filled in as part of the sector.
  /// [startAngle] The angle at which the arc starts, measured clockwise from
  ///     the positive x axis and expressed in radians
  /// [endAngle] The angle at which the arc ends, measured clockwise from the
  ///     positive x axis and expressed in radians.
  /// [fill] Fill color for the sector.
  /// [stroke] Stroke color of the arc and radius lines.
  /// [strokeWidthPx] Stroke width of the arc and radius lines.
  abstract drawCircleSector(
    center: Point,
    radius: number,
    innerRadius: number,
    startAngle: number,
    endAngle: number,
    {
      fill,
      stroke,
      strokeWidthPx,
    }: {
      fill: Color,
      stroke: Color,
      strokeWidthPx: number,
    },
  ): void;

  /// Renders a simple line.
  ///
  /// [dashPattern] controls the pattern of dashes and gaps in a line. It is a
  /// list of lengths of alternating dashes and gaps. The rendering is similar
  /// to stroke-dasharray in SVG path elements. An odd number of values in the
  /// pattern will be repeated to derive an even number of values. "1,2,3" is
  /// equivalent to "1,2,3,1,2,3."
  abstract drawLine({
    points,
    clipBounds,
    fill,
    stroke,
    roundEndCaps,
    strokeWidthPx,
    dashPattern,
  }: {
    points: Array<Point>,
    clipBounds: Rectangle,
    fill: Color,
    stroke: Color,
    roundEndCaps: boolean,
    strokeWidthPx: number,
    dashPattern: Array<number>,
  }): void;

  /// Renders a pie, with an optional hole in the center.
  abstract drawPie(canvasPie: CanvasPie): void;

  /// Renders a simple point.
  ///
  /// [point] The x, y coordinates of the point.
  ///
  /// [radius] The radius of the point.
  ///
  /// [fill] Fill color for the point.
  ///
  /// [stroke] and [strokeWidthPx] configure the color and thickness of the
  /// outer edge of the point. Both must be provided together for a line to
  /// appear.
  abstract drawPoint({
    point,
    radius,
    fill,
    stroke,
    strokeWidthPx,
  }: {
    point: Point,
    radius: number,
    fill: Color,
    stroke: Color,
    strokeWidthPx: number,
  }): void;

  /// Renders a polygon shape described by a set of points.
  ///
  /// [points] describes the vertices of the polygon. The last point will always
  /// be connected to the first point to close the shape.
  ///
  /// [fill] configures the color inside the polygon. The shape will be
  /// transparent if this is not provided.
  ///
  /// [stroke] and [strokeWidthPx] configure the color and thickness of the
  /// edges of the polygon. Both must be provided together for a line to appear.
  abstract drawPolygon({
    points,
    clipBounds,
    fill,
    stroke,
    strokeWidthPx,
  }: {
    points: Array<Point>,
    clipBounds: Rectangle,
    fill: Color,
    stroke: Color,
    strokeWidthPx: number,
  }): void;

  /// Renders a simple rectangle.
  ///
  /// [drawAreaBounds] if specified and if the bounds of the rectangle exceed
  /// the draw area bounds on the top, the first x pixels (decided by the native
  /// platform) exceeding the draw area will apply a gradient to transparent
  /// with anything exceeding the x pixels to be transparent.
  abstract drawRect(bounds: Rectangle, {

  }: {
    
  }): void;
}

/// Defines the pattern for a color fill.
///
/// * [forwardHatch] defines a pattern of white lines angled up and to the right
///   on top of a bar filled with the fill color.
/// * [solid] defines a simple bar filled with the fill color. This is the
///   default pattern for bars.
export enum FillPatternType { forwardHatch, solid }
