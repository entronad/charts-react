import { Rectangle } from 'package:dart/math';

import { GraphicsFactory } from '../../common/graphics-factory';
import { ChartCanvas } from '../common/chart-canvas';

// Position of a [LayoutView].
export enum LayoutPosition {
  Bottom,
  FullBottom,

  Top,
  FullTop,

  Left,
  FullLeft,

  Right,
  FullRight,

  DrawArea,
}

// Standard layout paint orders for all internal components.
//
// Custom component layers should define their paintOrder by taking the nearest
// layer from this list, and adding or subtracting 1. This will help reduce the
// chance of custom behaviors, renderers, etc. from breaking if we need to
// re-order these components internally.
export class LayoutViewPaintOrder {
  // Draw range annotations beneath axis grid lines.
  static readonly rangeAnnotation = -10;
  // Axis elements form the "base layer" of all components on the chart. Domain
  // axes are drawn on top of measure axes to ensure that the domain axis line
  // appears on top of any measure axis grid lines.
  static readonly measureAxis = 0;
  static readonly domainAxis = 5;
  // Draw series data on top of axis elements.
  static readonly arc = 10;
  static readonly bar = 10;
  static readonly treeMap = 10;
  static readonly barTargetLine = 15;
  static readonly line = 20;
  static readonly point = 25;
  // Draw most behaviors on top of series data.
  static readonly legend = 100;
  static readonly linePointHighlighter = 110;
  static readonly slider = 150;
  static readonly chartTitle = 160;
}

// Standard layout position orders for all internal components.
//
// Custom component layers should define their positionOrder by taking the
// nearest component from this list, and adding or subtracting 1. This will
// help reduce the chance of custom behaviors, renderers, etc. from breaking if
// we need to re-order these components internally.
export class LayoutViewPositionOrder {
  static readonly drawArea = 0;
  static readonly symbolAnnotation = 10;
  static readonly axis = 20;
  static readonly legend = 30;
  static readonly chartTitle = 40;
}

// A configuration for margin (empty space) around a layout child view.
export class ViewMargin {
  // A [ViewMargin] with all zero px.
  static readonly empty = new ViewMargin({topPx: 0, bottomPx: 0, rightPx: 0, leftPx: 0});

  readonly topPx: number;
  readonly bottomPx: number;
  readonly rightPx: number;
  readonly leftPx: number;

  constructor({
    topPx,
    bottomPx,
    rightPx,
    leftPx,
  }: {
    topPx?: number,
    bottomPx?: number,
    rightPx?: number,
    leftPx?: number,
  } = {}) {
    this.topPx = topPx || 0;
    this.bottomPx = bottomPx || 0;
    this.rightPx = rightPx || 0;
    this.leftPx = leftPx || 0;
  }

  // Total width.
  get width() {
    return this.leftPx + this.rightPx;
  }

  // Total height.
  get height() {
    return this.topPx + this.bottomPx;
  }
}

// Configuration of a [LayoutView].
export class LayoutViewConfig {
  // Unique identifier for the [LayoutView].
  id: string;

  // The order to paint a [LayoutView] on the canvas.
  //
  // The smaller number is drawn first.
  paintOrder: number;

  // The position of a [LayoutView] defining where to place the view.
  position: LayoutPosition;

  // The order to place the [LayoutView] within a chart margin.
  //
  // The smaller number is closer to the draw area. Elements positioned closer
  // to the draw area will be given extra layout space first, before those
  // further away.
  //
  // Note that all views positioned in the draw area are given the entire draw
  // area bounds as their component bounds.
  positionOrder: number;

  // Defines the space around a layout component.
  viewMargin: ViewMargin;

  // Creates new [LayoutParams].
  //
  // [paintOrder] the order that this component will be drawn.
  // [position] the [ComponentPosition] of this component.
  // [positionOrder] the order of this component in a chart margin.
  constructor({
    paintOrder,
    position,
    positionOrder,
    viewMargin,
  }: {
    paintOrder: number,
    position: LayoutPosition,
    positionOrder: number,
    viewMargin?: ViewMargin,
  }) {
    this.paintOrder = paintOrder;
    this.position = position;
    this.positionOrder = positionOrder;
    this.viewMargin = viewMargin || ViewMargin.empty;
  }

  // Returns true if it is a full position.
  get isFullPosition() {
    return this.position === LayoutPosition.FullBottom ||
    this.position === LayoutPosition.FullTop ||
    this.position === LayoutPosition.FullRight ||
    this.position === LayoutPosition.FullLeft;
  }
}

// Size measurements of one component.
//
// The measurement is tight to the component, without adding [ComponentBuffer].
export class ViewMeasuredSizes {
  readonly preferredWidth: number;
  readonly preferredHeight: number;
  readonly minWidth: number;
  readonly minHeight: number;

  // Create a new [ViewSizes].
  //
  // [preferredWidth] the component's preferred width.
  // [preferredHeight] the component's preferred width.
  // [minWidth] the component's minimum width. If not set, default to 0.
  // [minHeight] the component's minimum height. If not set, default to 0.
  constructor({
    preferredWidth,
    preferredHeight,
    minWidth,
    minHeight,
  }: {
    preferredWidth: number,
    preferredHeight: number,
    minWidth?: number,
    minHeight?: number,
  }) {
    this.preferredWidth = preferredWidth;
    this.preferredHeight = preferredHeight;
    this.minWidth = minWidth || 0;
    this.minHeight = minHeight || 0;
  }
}

// A component that measures its size and accepts bounds to complete layout.
export abstract class LayoutView {
  abstract get graphicsFactory(): GraphicsFactory;

  abstract set graphicsFactory(value: GraphicsFactory);

  // Layout params for this component.
  abstract get layoutConfig(): LayoutViewConfig;

  // Measure and return the size of this component.
  //
  // This measurement is without the [ComponentBuffer], which is added by the
  // layout manager.
  abstract measure(maxWidth: number, maxHeight: number): ViewMeasuredSizes;

  // Layout this component.
  abstract layout(componentBounds: Rectangle, drawAreaBounds: Rectangle): void;

  // Draw this component on the canvas.
  abstract paint(canvas: ChartCanvas, animationPercent: number): void;

  // Bounding box for drawing this component.
  abstract get componentBounds(): Rectangle;

  // Whether or not this component is a series renderer that draws series
  // data.
  //
  // This component may either render into the chart's draw area, or into a
  // separate area bounded by the component bounds.
  abstract get isSeriesRenderer(): boolean;
}
