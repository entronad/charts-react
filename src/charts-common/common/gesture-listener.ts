/* eslint-disable no-unused-vars */

import { Point } from 'package:dart/math';

// Listener to touch gestures.
//
// [GestureListeners] can override only the gestures it is interested in.
//
// Each gesture returns true if the event is consumed or false if it should
// continue to alert other listeners.
export class GestureListener {
  static readonly defaultTapCancel: GestureCancelCallback = () => {};
  static readonly defaultTapTest: GestureSinglePointCallback = (_) => false;

  // Called before all gestures (except onHover) as a preliminary test to
  // see who is interested in an event.
  //
  // All listeners that return true will get the next gesture event.
  //
  // Any listener that returns false will only get the next gesture event if
  // no one returned true.
  //
  // This is useful for figuring out who is claiming a gesture event.
  // Example: SelectNearest returns true for onTapTest if the point is within
  // the drawArea. SeriesLegend returns true for onTapTest if the point is
  // within the legend. If the tap occurs in either of those places the
  // corresponding listener. If the tap occurs outside of both targets, then
  // both will be given the event so they can deselect everything in the
  // selection model.
  //
  // Defaults to function that returns false allowing other listeners to preempt.
  readonly onTapTest: GestureSinglePointCallback;

  // Called if onTapTest was previously called, but listener is being preempted.
  readonly onTapCancel: GestureCancelCallback;

  // Called after the tap event has been going on for a period of time (500ms)
  // without moving much (20px).
  // The onTap or onDragStart gestures can still trigger after this gesture.
  readonly onLongPress: GestureSinglePointCallback;

  // Called on tap up if not dragging.
  readonly onTap: GestureSinglePointCallback;

  // Called when a mouse hovers over the chart. (No tap event).
  readonly onHover: GestureSinglePointCallback;

  // Called when the tap event has moved beyond a threshold indicating that
  // the user is dragging.
  //
  // This will only be called once per drag gesture independent of how many
  // touches are going on until the last touch is complete. onDragUpdate is
  // called as touches move updating the scale as determined by the first
  // two points. onDragEnd is called when the last touch event lifts and the
  // velocity is calculated from the final movement.
  //
  // onDragStart, onDragUpdate, and onDragEnd are also called for mouse wheel
  // with the scale and point updated given the WheelEvent (deltaY updates the
  // scale, deltaX updates the event point/pans).
  //
  // TODO: Add a "discrete" flag that tells drag listeners whether
  // they should be expecting a series of continuous updates, or one large
  // update. This will mostly be used to control whether we animate the chart
  // between onDragUpdate calls.
  //
  // TODO: Investigate low performance of chart rendering from
  // flutter when animation is enabled and we pinch to zoom on the chart.
  readonly onDragStart: GestureDragStartCallback;
  readonly onDragUpdate: GestureDragUpdateCallback;
  readonly onDragEnd: GestureDragEndCallback;

  constructor({
    onTapTest,
    onTapCancel,
    onLongPress,
    onTap,
    onHover,
    onDragStart,
    onDragUpdate,
    onDragEnd,
  }: {
    onTapTest?: GestureSinglePointCallback;
    onTapCancel?: GestureCancelCallback;
    onLongPress?: GestureSinglePointCallback;
    onTap?: GestureSinglePointCallback;
    onHover?: GestureSinglePointCallback;
    onDragStart?: GestureDragStartCallback;
    onDragUpdate?: GestureDragUpdateCallback;
    onDragEnd?: GestureDragEndCallback;
  } = {}) {
    this.onTapTest = onTapTest || GestureListener.defaultTapTest;
    this.onTapCancel = onTapCancel || GestureListener.defaultTapCancel;
    this.onLongPress = onLongPress;
    this.onTap = onTap;
    this.onHover = onHover;
    this.onDragStart = onDragStart;
    this.onDragUpdate = onDragUpdate;
    this.onDragEnd = onDragEnd;
  }
}

export interface GestureCancelCallback {
  (): void;
}
export interface GestureSinglePointCallback {
  (localPosition: Point): boolean;
}

export interface GestureDragStartCallback {
  (localPosition: Point): boolean;
}
export interface GestureDragUpdateCallback {
  (localPosition: Point, scale: number): void;
}
export interface GestureDragEndCallback {
  (localPosition: Point, scale: number, pixelsPerSec: number): void;
}
