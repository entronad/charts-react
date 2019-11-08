import { Point } from 'package:dart/math';
import { remove } from 'package:dart/array';

import { GestureListener } from './gesture-listener';

// Listens to all gestures and proxies to child listeners.
export class ProxyGestureListener {
  readonly _listeners: Array<GestureListener> = [];
  _activeListeners: Array<GestureListener> = [];

  add = (listener: GestureListener) => {
    this._listeners.push(listener);
    this._activeListeners.length = 0;
  };

  remove = (listener: GestureListener) => {
    remove(this._listeners, listener);
    this._activeListeners.length = 0;
  };

  onTapTest = (localPosition: Point) => {
    this._activeListeners.length = 0;
    return this._populateActiveListeners(localPosition);
  };

  onLongPress = (localPosition: Point) => {
    // Walk through listeners stopping at the first handled listener.
    const claimingListener = this._activeListeners.find(
      (listener) => listener.onLongPress && listener.onLongPress(localPosition)
    );

    // If someone claims the long press, then cancel everyone else.
    if (claimingListener) {
      this._activeListeners = this._cancel(this._activeListeners, [claimingListener]);
      return true;
    }
    return false;
  };

  onTap = (localPosition: Point) => {
    // Walk through listeners stopping at the first handled listener.
    const claimingListener = this._activeListeners.find(
      (listener) => listener.onTap && listener.onTap(localPosition)
    );

    // If someone claims the long press, then cancel everyone else.
    if (claimingListener) {
      this._activeListeners = this._cancel(this._activeListeners, [claimingListener]);
      return true;
    }
    return false;
  };

  onHover = (localPosition: Point) => {
    // Cancel any previously active long lived gestures.
    this._activeListeners = [];

    // Walk through listeners stopping at the first handled listener.
    return this._listeners.findIndex(
      (listener) => listener.onHover && listener.onHover(localPosition)
    ) > -1;
  };

  onDragStart = (localPosition: Point) => {
    // In Flutter, a tap test may not be triggered because a tap down event
    // may not be registered if the the drag gesture happens without any pause.
    if (this._activeListeners.length === 0) {
      this._populateActiveListeners(localPosition);
    }

    // Walk through listeners stopping at the first handled listener.
    const claimingListener = this._activeListeners.find(
      (listener) => listener.onDragStart && listener.onDragStart(localPosition)
    );

    if (claimingListener) {
      this._activeListeners = this._cancel(this._activeListeners, [claimingListener]);
      return true;
    }
    return false;
  };

  onDragUpdate = (localPosition: Point, scale: number) => this._activeListeners.findIndex(
    (listener) => listener.onDragUpdate && listener.onDragUpdate(localPosition, scale)
  ) > -1;

  onDragEnd = (
    localPosition: Point,
    scale: number,
    pixelsPerSecond: number,
  ) => this._activeListeners.findIndex(
    (listener) =>
      listener.onDragEnd && listener.onDragEnd(localPosition, scale, pixelsPerSecond)
  ) > -1;

  _cancel = (all: Array<GestureListener>, keep: Array<GestureListener>) => {
    all.forEach((listener) => {
      if (!keep.includes(listener)) {
        listener.onTapCancel();
      }
    });
    return keep;
  };

  _populateActiveListeners = (localPosition: Point) => {
    const localListeners: Array<GestureListener> = Array.from(this._listeners);

    let previouslyClaimed = false;
    localListeners.forEach((listener) => {
      const claimed = listener.onTapTest(localPosition);
      if (claimed && !previouslyClaimed) {
        // Cancel any already added non-claiming listeners now that someone is
        // claiming it.
        this._activeListeners = this._cancel(this._activeListeners, [listener]);
        previouslyClaimed = true;
      } else if (claimed || !previouslyClaimed) {
        this._activeListeners.push(listener);
      }
    });

    return previouslyClaimed;
  };
}
