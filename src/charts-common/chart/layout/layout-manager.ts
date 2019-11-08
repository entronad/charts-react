import { Point, Rectangle } from 'package:dart/math';

import { LayoutView } from './layout-view';

export abstract class LayoutManager {
  // Adds a view to be managed by the LayoutManager.
  abstract addView(view: LayoutView): void;

  // Removes a view previously added to the LayoutManager.
  // No-op if it wasn't there to begin with.
  abstract removeView(view: LayoutView): void;

  // Returns true if view is already attached.
  abstract isAttached(view: LayoutView): boolean;

  // Walk through the child views and determine their desired sizes storing
  // off the information for layout.
  abstract measure(width: number, height: number): void;

  // Walk through the child views and set their bounds from the perspective
  // of the canvas origin.
  abstract layout(width: number, height: number): void;

  // Returns the bounds of the drawArea. Must be called after layout().
  abstract get drawAreaBounds(): Rectangle;

  // Returns the combined bounds of the drawArea, and all components that
  // function as series draw areas. Must be called after layout().
  abstract get drawableLayoutAreaBounds(): Rectangle;

  // Gets the measured size of the bottom margin, available after layout.
  abstract get marginBottom(): number;

  // Gets the measured size of the left margin, available after layout.
  abstract get marginLeft(): number;

  // Gets the measured size of the right margin, available after layout.
  abstract get marginRight(): number;

  // Gets the measured size of the top margin, available after layout.
  abstract get marginTop(): number;

  // Returns whether or not [point] is within the draw area bounds.
  abstract withinDrawArea(point: Point): boolean;

  // Walk through the child views and apply the function passed in.
  abstract applyToViews(apply: (view: LayoutView) => void): void;

  // Return the child views in the order that they should be drawn.
  abstract get paintOrderedViews(): Array<LayoutView>;

  // Return the child views in the order that they should be positioned within
  // chart margins.
  abstract get positionOrderedViews(): Array<LayoutView>;
}
