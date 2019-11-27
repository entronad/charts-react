import { Rectangle } from 'package:dart/math';
import { LayoutView, ViewMeasuredSizes } from './layout-view';

export class SizeList {
  readonly _size: Array<number> = [];
  _total = 0;

  get = (i: number) => this._size[i];

  get total() {
    return this._total;
  }

  get length() {
    return this._size.length;
  }

  add = (size: number) => {
    this._size.push(size);
    this._total += size;
  }

  adjust = (index: number, amount: number) => {
    this._size[index] += amount;
    this._total += amount;
  }
}

class _DesiredViewSizes {
  readonly preferredSizes = new SizeList();
  readonly minimumSizes = new SizeList();

  add = (preferred: number, minimum: number) => {
    this.preferredSizes.add(preferred);
    this.minimumSizes.add(minimum);
  }

  adjustedTo = (maxSize: number) => {
    if (maxSize < this.preferredSizes.total) {
      let delta = this.preferredSizes.total - maxSize;
      for (let i = this.preferredSizes.length - 1; i >= 0; i--) {
        const viewAvailablePx = this.preferredSizes.get(i) - this.minimumSizes.get(i);

        if (viewAvailablePx < delta) {
          // We need even more than this one view can give up, so assign the
          // minimum to the view and adjust totals.
          this.preferredSizes.adjust(i, -viewAvailablePx);
          delta -= viewAvailablePx;
        } else {
          // We can adjust this view to account for the delta.
          this.preferredSizes.adjust(i, -delta);
          return;
        }
      }
    }
  }
}

// A strategy for calculating size of vertical margins (RIGHT & LEFT).
export abstract class VerticalMarginStrategy {
  measure = (views: Array<LayoutView>, {
    maxWidth,
    height,
    fullHeight,
  }: {
    maxWidth: number,
    height: number,
    fullHeight: number,
  }) => {
    const measuredWidths = new _DesiredViewSizes();
    let remainingWidth = maxWidth;

    views.forEach((view) => {
      const params = view.layoutConfig;
      const { viewMargin } = params;

      const availableHeight =
        (params.isFullPosition ? fullHeight : height) - viewMargin.height;
      
      // Measure with all available space, minus the buffer.
      remainingWidth -= viewMargin.width;
      maxWidth -= viewMargin.width;

      let size = ViewMeasuredSizes.zero;
      // Don't ask component to measure if both measurements are 0.
      //
      // Measure still needs to be called even when one dimension has a size of
      // zero because if the component is an axis, the axis needs to still
      // recalculate ticks even if it is not to be shown.
      if (remainingWidth > 0 || availableHeight > 0) {
        size = view.measure(remainingWidth, availableHeight);
        remainingWidth -= size.preferredWidth;
      }

      measuredWidths.add(size.preferredWidth, size.minWidth);
    });

    measuredWidths.adjustedTo(maxWidth);
    return measuredWidths.preferredSizes;
  };

  abstract layout(
    views: Array<LayoutView>,
    measuredSizes: SizeList,
    fullBounds: Rectangle,
    drawAreaBounds: Rectangle,
  ): void;
}

// A strategy for calculating size and bounds of left margins.
export class LeftMarginLayoutStrategy extends VerticalMarginStrategy {
  layout = (
    views: Array<LayoutView>,
    measuredSizes: SizeList,
    fullBounds: Rectangle,
    drawAreaBounds: Rectangle,
  ) => {
    let prevBoundsRight = drawAreaBounds.left;

    let i = 0;
    views.forEach((view) => {
      const params = view.layoutConfig;

      const width = measuredSizes.get(i);
      const left = prevBoundsRight - params.viewMargin.rightPx - width;
      const height =
          (params.isFullPosition ? fullBounds.height : drawAreaBounds.height) -
              params.viewMargin.height;
      const top = params.viewMargin.topPx +
          (params.isFullPosition ? fullBounds.top : drawAreaBounds.top);

      // Update the remaining bounds.
      prevBoundsRight = left - params.viewMargin.leftPx;

      // Layout this component.
      view.layout(new Rectangle(left, top, width, height), drawAreaBounds);

      i++;
    });
  };
}

// A strategy for calculating size and bounds of right margins.
export class RightMarginLayoutStrategy extends VerticalMarginStrategy {
  layout = (
    views: Array<LayoutView>,
    measuredSizes: SizeList,
    fullBounds: Rectangle,
    drawAreaBounds: Rectangle,
  ) => {
    let prevBoundsLeft = drawAreaBounds.right;

    let i = 0;
    views.forEach((view) => {
      const params = view.layoutConfig;

      const width = measuredSizes.get(i);
      const left = prevBoundsLeft + params.viewMargin.leftPx;
      const height =
          (params.isFullPosition ? fullBounds.height : drawAreaBounds.height) -
              params.viewMargin.height;
      const top = params.viewMargin.topPx +
          (params.isFullPosition ? fullBounds.top : drawAreaBounds.top);

      // Update the remaining bounds.
      prevBoundsLeft = left + width + params.viewMargin.rightPx;

      // Layout this component.
      view.layout(new Rectangle(left, top, width, height), drawAreaBounds);

      i++;
    });
  }
}

// A strategy for calculating size of horizontal margins (TOP & BOTTOM).
export abstract class HorizontalMarginStrategy {
  measure = (views: Array<LayoutView>, {
    maxHeight,
    width,
    fullWidth,
  }: {
    maxHeight: number,
    width: number,
    fullWidth: number,
  }) => {
    const measuredHeights = new _DesiredViewSizes();
    let remainingHeight = maxHeight;

    views.forEach((view) => {
      const params = view.layoutConfig;
      const { viewMargin } = params;

      const availableWidth =
        (params.isFullPosition ? fullWidth : width) - viewMargin.width;
      
      // Measure with all available space, minus the buffer.
      remainingHeight -= viewMargin.height;
      maxHeight -= viewMargin.height;

      let size = ViewMeasuredSizes.zero;
      // Don't ask component to measure if both measurements are 0.
      //
      // Measure still needs to be called even when one dimension has a size of
      // zero because if the component is an axis, the axis needs to still
      // recalculate ticks even if it is not to be shown.
      if (remainingHeight > 0 || availableWidth > 0) {
        size = view.measure(availableWidth, remainingHeight);
        remainingHeight -= size.preferredHeight;
      }

      measuredHeights.add(size.preferredHeight, size.minHeight);
    });

    measuredHeights.adjustedTo(maxHeight);
    return measuredHeights.preferredSizes;
  };

  abstract layout(
    views: Array<LayoutView>,
    measuredSizes: SizeList,
    fullBounds: Rectangle,
    drawAreaBounds: Rectangle,
  ): void;
}

// A strategy for calculating size and bounds of top margins.
export class TopMarginLayoutStrategy extends HorizontalMarginStrategy {
  layout = (
    views: Array<LayoutView>,
    measuredSizes: SizeList,
    fullBounds: Rectangle,
    drawAreaBounds: Rectangle,
  ) => {
    let prevBoundsBottom = drawAreaBounds.top;

    let i = 0;
    views.forEach((view) => {
      const params = view.layoutConfig;

      const height = measuredSizes.get(i);
      const top = prevBoundsBottom - height - params.viewMargin.bottomPx;

      const width =
          (params.isFullPosition ? fullBounds.width : drawAreaBounds.width) -
              params.viewMargin.width;
      const left = params.viewMargin.leftPx +
          (params.isFullPosition ? fullBounds.left : drawAreaBounds.left);

      // Update the remaining bounds.
      prevBoundsBottom = top - params.viewMargin.topPx;

      // Layout this component.
      view.layout(new Rectangle(left, top, width, height), drawAreaBounds);

      i++;
    });
  };
}

// A strategy for calculating size and bounds of bottom margins.
export class BottomMarginLayoutStrategy extends HorizontalMarginStrategy {
  layout = (
    views: Array<LayoutView>,
    measuredSizes: SizeList,
    fullBounds: Rectangle,
    drawAreaBounds: Rectangle,
  ) => {
    let prevBoundsTop = drawAreaBounds.bottom;

    let i = 0;
    views.forEach((view) => {
      const params = view.layoutConfig;

      const height = measuredSizes.get(i);
      const top = prevBoundsTop + params.viewMargin.topPx;

      const width =
          (params.isFullPosition ? fullBounds.width : drawAreaBounds.width) -
              params.viewMargin.width;
      const left = params.viewMargin.leftPx +
          (params.isFullPosition ? fullBounds.left : drawAreaBounds.left);

      // Update the remaining bounds.
      prevBoundsTop = top + height + params.viewMargin.bottomPx;

      // Layout this component.
      view.layout(new Rectangle(left, top, width, height), drawAreaBounds);

      i++;
    });
  };
}
