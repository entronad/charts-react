import { Point, Rectangle } from 'package:dart/math';
import { assert } from 'package:dart/keywords';
import { get } from 'package:dart/operators';

import { LayoutConfig } from './layout-config';
import { LayoutManager } from './layout-manager';
import {
  SizeList,
  LeftMarginLayoutStrategy,
  RightMarginLayoutStrategy,
  BottomMarginLayoutStrategy,
  TopMarginLayoutStrategy,
} from './layout-margin-strategy';
import { LayoutView, LayoutPosition } from './layout-view';

// Default Layout manager for [LayoutView]s.
export class LayoutManagerImpl implements LayoutManager {
  static readonly _minDrawWidth = 20;
  static readonly _minDrawHeight = 20;

  // Allow [Layoutconfig] to be mutable so it can be modified without requiring
  // a new copy of [DefaultLayoutManager] to be created.
  config: LayoutConfig;

  // Unordered list of views in the layout.
  readonly _views: Array<LayoutView> = [];

  // List of views in the order they should be drawn on the canvas.
  //
  // First element is painted first.
  _paintOrderedViews: Array<LayoutView>;

  // List of vies in the order they should be positioned in a chart margin.
  //
  // First element is closest to the draw area.
  _positionOrderedViews: Array<LayoutView>;

  _measurements: _MeasuredSizes;

  _drawAreaBounds: Rectangle;
  _drawAreaBoundsOutdated: boolean = true;
  _viewsNeedPaintSort: boolean = true;
  _viewsNeedPositionSort: boolean = true;

  // Create a new [LayoutManager].
  constructor({ config }: { config?: LayoutConfig } = {}) {
    this.config = config || new LayoutConfig();
  }

  // Add one [LayoutView].
  addView = (view: LayoutView) => {
    this._views.push(view);
    this._drawAreaBoundsOutdated = true;
    this._viewsNeedPositionSort = true;
    this._viewsNeedPaintSort = true;
  };

  // Remove one [LayoutView].
  removeView = (view: LayoutView) => {
    if (this._views.includes(view)) {
      const viewIndex = this._views.indexOf(view);
      this._views.splice(viewIndex, 1);
      this._drawAreaBoundsOutdated = true;
      this._viewsNeedPositionSort = true;
      this._viewsNeedPaintSort = true;
    }
  }

  // Returns true if [view] is already attached.
  isAttached = (view: LayoutView) => this._views.includes(view);

  // Get all layout components in the order to be drawn.
  get paintOrderedViews() {
    if (this._viewsNeedPaintSort) {
      this._paintOrderedViews = [...this._views];

      this._paintOrderedViews.sort((v1, v2) =>
        v1.layoutConfig.paintOrder - v2.layoutConfig.paintOrder);

      this._viewsNeedPaintSort = false;
    }
    return this._paintOrderedViews;
  }

  // Get all layout components in the order to be visited.
  get positionOrderedViews() {
    if (this._viewsNeedPositionSort) {
      this._positionOrderedViews = [...this._views];

      this._positionOrderedViews.sort((v1, v2) => 
        v1.layoutConfig.positionOrder - v2.layoutConfig.positionOrder);

      this._viewsNeedPositionSort = false;
    }
    return this._positionOrderedViews;
  }

  get drawAreaBounds() {
    assert(this._drawAreaBoundsOutdated === false);
    return this._drawAreaBounds;
  }

  get drawableLayoutAreaBounds() {
    assert(this._drawAreaBoundsOutdated === false);

    const drawableViews =
      this._views.filter((view) => view.isSeriesRenderer);
    
    let componentBounds = get(drawableViews, 'first.componentBounds');

    if (componentBounds != null) {
      for (const view of drawableViews.slice(2)) {
        if (view.componentBounds != null) {
          componentBounds = componentBounds.boundingBox(view.componentBounds);
        }
      }
    } else {
      componentBounds = new Rectangle(0, 0, 0, 0);
    }

    return componentBounds;
  }

  get marginBottom() {
    assert(this._drawAreaBoundsOutdated === false);
    return this._measurements.bottomHeight;
  }

  get marginLeft() {
    assert(this._drawAreaBoundsOutdated === false);
    return this._measurements.leftWidth;
  }

  get marginRight() {
    assert(this._drawAreaBoundsOutdated === false);
    return this._measurements.rightWidth;
  }

  get marginTop() {
    assert(this._drawAreaBoundsOutdated === false);
    return this._measurements.topHeight;
  }

  withinDrawArea = (point: Point) =>
    this._drawAreaBounds.containsPoint(point);
  
  // Measure and layout with given [width] and [height].
  measure = (width: number, height: number) => {
    const topViews =
        this._viewsForPositions(LayoutPosition.Top, LayoutPosition.FullTop);
    const rightViews =
        this._viewsForPositions(LayoutPosition.Right, LayoutPosition.FullRight);
    const bottomViews =
        this._viewsForPositions(LayoutPosition.Bottom, LayoutPosition.FullBottom);
    const leftViews =
        this._viewsForPositions(LayoutPosition.Left, LayoutPosition.FullLeft);

    // Assume the full width and height of the chart is available when measuring
    // for the first time but adjust the maximum if margin spec is set.
    let measurements = this._measure(width, height, {
        topViews,
        rightViews,
        bottomViews,
        leftViews,
        useMax: true});

    // Measure a second time but pass in the preferred width and height from
    // the first measure cycle.
    // Allow views to report a different size than the previously measured max.
    const secondMeasurements = this._measure(width, height, {
        topViews,
        rightViews,
        bottomViews,
        leftViews,
        previousMeasurements: measurements,
        useMax: true});
    
    // If views need more space with the 2nd pass, perform a third pass.
    if (measurements.leftWidth !== secondMeasurements.leftWidth ||
      measurements.rightWidth !== secondMeasurements.rightWidth ||
      measurements.topHeight !== secondMeasurements.topHeight ||
      measurements.bottomHeight !== secondMeasurements.bottomHeight) {
      const thirdMeasurements = this._measure(width, height, {
          topViews,
          rightViews,
          bottomViews,
          leftViews,
          previousMeasurements: secondMeasurements,
          useMax: false});

      measurements = thirdMeasurements;
    } else {
      measurements = secondMeasurements;
    }

    this._measurements = measurements;

    // Draw area size.
    // Set to a minimum size if there is not enough space for the draw area.
    // Prevents the app from crashing by rendering overlapping content instead.
    const drawAreaWidth = Math.max(
      LayoutManagerImpl._minDrawWidth,
      (width - measurements.leftWidth - measurements.rightWidth),
    );
    const drawAreaHeight = Math.max(
      LayoutManagerImpl._minDrawHeight,
      (height - measurements.bottomHeight - measurements.topHeight),
    );

    // Bounds for the draw area.
    this._drawAreaBounds = new Rectangle(measurements.leftWidth,
        measurements.topHeight, drawAreaWidth, drawAreaHeight);
    this._drawAreaBoundsOutdated = false;
  }

  layout = (width: number, height: number) => {
    const topViews =
        this._viewsForPositions(LayoutPosition.Top, LayoutPosition.FullTop);
    const rightViews =
        this._viewsForPositions(LayoutPosition.Right, LayoutPosition.FullRight);
    const bottomViews =
        this._viewsForPositions(LayoutPosition.Bottom, LayoutPosition.FullBottom);
    const leftViews =
        this._viewsForPositions(LayoutPosition.Left, LayoutPosition.FullLeft);
    const drawAreaViews = this._viewsForPositions(LayoutPosition.DrawArea);

    const fullBounds = new Rectangle(0, 0, width, height);

    // Layout the margins.
    new LeftMarginLayoutStrategy()
        .layout(leftViews, this._measurements.leftSizes, fullBounds, this.drawAreaBounds);
    new RightMarginLayoutStrategy().layout(
        rightViews, this._measurements.rightSizes, fullBounds, this.drawAreaBounds);
    new BottomMarginLayoutStrategy().layout(
        bottomViews, this._measurements.bottomSizes, fullBounds, this.drawAreaBounds);
    new TopMarginLayoutStrategy()
        .layout(topViews, this._measurements.topSizes, fullBounds, this.drawAreaBounds);

    // Layout the drawArea.
    drawAreaViews.forEach(
        (view) => view.layout(this._drawAreaBounds, this._drawAreaBounds));
  }

  _viewsForPositions = (p1: LayoutPosition, p2?: LayoutPosition) =>
    this.positionOrderedViews.filter((view) =>
      view.layoutConfig.position === p1 || (p2 && view.layoutConfig.position === p2));
  
  // Measure and return size measurements.
  // [width] full width of chart
  // [height] full height of chart
  _measure = (width: number, height: number, {
    topViews,
    rightViews,
    bottomViews,
    leftViews,
    previousMeasurements,
    useMax,
  }: {
    topViews?: Array<LayoutView>,
    rightViews?: Array<LayoutView>,
    bottomViews?: Array<LayoutView>,
    leftViews?: Array<LayoutView>,
    previousMeasurements?: _MeasuredSizes,
    useMax: boolean,
  }) => {
    const maxLeftWidth = this.config.leftSpec.getMaxPixels(width);
    const maxRightWidth = this.config.rightSpec.getMaxPixels(width);
    const maxBottomHeight = this.config.bottomSpec.getMaxPixels(height);
    const maxTopHeight = this.config.topSpec.getMaxPixels(height);

    // Assume the full width and height of the chart is available when measuring
    // for the first time but adjust the maximum if margin spec is set.
    let leftWidth = get(previousMeasurements, 'leftWidth') || maxLeftWidth;
    let rightWidth = get(previousMeasurements, 'rightWidth') || maxRightWidth;
    let bottomHeight = get(previousMeasurements, 'bottomHeight') || maxBottomHeight;
    let topHeight = get(previousMeasurements, 'topHeight') || maxTopHeight;

    // Only adjust the height if we have previous measurements.
    const adjustedHeight = (previousMeasurements)
      ? height - bottomHeight - topHeight
      : height;

    const leftSizes = new LeftMarginLayoutStrategy().measure(leftViews, {
      maxWidth: useMax ? maxLeftWidth : leftWidth,
      height: adjustedHeight,
      fullHeight: height});

    leftWidth = Math.max(leftSizes.total, this.config.leftSpec.getMinPixels(width));

    const rightSizes = new RightMarginLayoutStrategy().measure(rightViews, {
      maxWidth: useMax ? maxRightWidth : rightWidth,
      height: adjustedHeight,
      fullHeight: height});
    rightWidth = Math.max(rightSizes.total, this.config.rightSpec.getMinPixels(width));

    const adjustedWidth = width - leftWidth - rightWidth;

    const bottomSizes = new BottomMarginLayoutStrategy().measure(bottomViews, {
      maxHeight: useMax ? maxBottomHeight : bottomHeight,
      width: adjustedWidth,
      fullWidth: width});
    bottomHeight =
        Math.max(bottomSizes.total, this.config.bottomSpec.getMinPixels(height));

    const topSizes = new TopMarginLayoutStrategy().measure(topViews, {
      maxHeight: useMax ? maxTopHeight : topHeight,
      width: adjustedWidth,
      fullWidth: width});
    topHeight = Math.max(topSizes.total, this.config.topSpec.getMinPixels(height));

    return new _MeasuredSizes({
      leftWidth,
      leftSizes,
      rightWidth,
      rightSizes,
      topHeight,
      topSizes,
      bottomHeight,
      bottomSizes});
  };

  applyToViews = (apply: (view: LayoutView) => void) => {
    this._views.forEach(apply);
  }
}

// Helper class that stores measured width and height during measure cycles.
class _MeasuredSizes {
  readonly leftWidth: number;
  readonly leftSizes: SizeList;

  readonly rightWidth: number;
  readonly rightSizes: SizeList;

  readonly topHeight: number;
  readonly topSizes: SizeList;

  readonly bottomHeight: number;
  readonly bottomSizes: SizeList;

  constructor({
    leftWidth,
    leftSizes,
    rightWidth,
    rightSizes,
    topHeight,
    topSizes,
    bottomHeight,
    bottomSizes,
  }: {
    leftWidth?: number,
    leftSizes?: SizeList,
    rightWidth?: number,
    rightSizes?: SizeList,
    topHeight?: number,
    topSizes?: SizeList,
    bottomHeight?: number,
    bottomSizes?: SizeList,
  } = {}) {
    this.leftWidth = leftWidth;
    this.leftSizes = leftSizes;
    this.rightWidth = rightWidth;
    this.rightSizes = rightSizes;
    this.topHeight = topHeight;
    this.topSizes = topSizes;
    this.bottomHeight = bottomHeight;
    this.bottomSizes = bottomSizes;
  }
}
