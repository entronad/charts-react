import { assert } from 'package:dart/core';

// Collection of configurations that apply to the [LayoutManager].
export class LayoutConfig {
  readonly leftSpec: MarginSpec;
  readonly rightSpec: MarginSpec;
  readonly topSpec: MarginSpec;
  readonly bottomSpec: MarginSpec;

  // Create a new [LayoutConfig] used by [DynamicLayoutManager].
  constructor({
    leftSpec,
    rightSpec,
    topSpec,
    bottomSpec,
  }: {
    leftSpec?: MarginSpec,
    rightSpec?: MarginSpec,
    topSpec?: MarginSpec,
    bottomSpec?: MarginSpec,
  } = {}) {
    this.leftSpec = leftSpec ?? MarginSpec.defaultSpec;
    this.rightSpec = rightSpec ?? MarginSpec.defaultSpec;
    this.topSpec = topSpec ?? MarginSpec.defaultSpec;
    this.bottomSpec = bottomSpec ?? MarginSpec.defaultSpec;
  }
}

// Specs that applies to one margin.
export class MarginSpec {
  // [MarginSpec] that has max of 50 percent.
  static readonly defaultSpec = new MarginSpec(null, null, null, 50);

  readonly _minPixel: number;
  readonly _maxPixel: number;
  readonly _minPercent: number;
  readonly _maxPercent: number;

  constructor(
    minPixel: number,
    maxPixel: number,
    minPercent: number,
    maxPercent: number,
  ) {
    this._minPixel = minPixel;
    this._maxPixel = maxPixel;
    this._minPercent = minPercent;
    this._maxPercent = maxPercent;
  }

  // Create [MarginSpec] that specifies min/max pixels.
  //
  // [minPixel] if set must be greater than or equal to 0 and less than max if
  // it is also set.
  // [maxPixel] if set must be greater than or equal to 0.
  static fromPixel({
    minPixel,
    maxPixel,
  }: {
    minPixel?: number,
    maxPixel?: number,
  } = {}) {
    // Require zero or higher settings if set
    assert(minPixel == null || minPixel >= 0);
    assert(maxPixel == null || maxPixel >= 0);
    // Min must be less than or equal to max.
    // Can be equal to enforce strict pixel size.
    if (minPixel && maxPixel) {
      assert(minPixel <= maxPixel);
    }

    return new MarginSpec(minPixel, maxPixel, null, null);
  }

  // Create [MarginSpec] with a fixed pixel size [pixels].
  //
  // [pixels] if set must be greater than or equal to 0.
  fixedPixel(pixels: number) {
    // Require require or higher setting if set
    assert(pixels == null || pixels >= 0);

    return new MarginSpec(pixels, pixels, null, null);
  }

  // Create [MarginSpec] that specifies min/max percentage.
  //
  // [minPercent] if set must be between 0 and 100 inclusive. If [maxPercent]
  // is also set, then must be less than [maxPercent].
  // [maxPercent] if set must be between 0 and 100 inclusive.
  static fromPercent({
    minPercent,
    maxPercent,
  }: {
    minPercent?: number,
    maxPercent?: number,
  } = {}) {
    // Percent must be within 0 to 100
    assert(minPercent == null || (minPercent >= 0 && minPercent <= 100));
    assert(maxPercent == null || (maxPercent >= 0 && maxPercent <= 100));
    // Min must be less than or equal to max.
    // Can be equal to enforce strict percentage.
    if (minPercent && maxPercent) {
      assert(minPercent <= maxPercent);
    }

    return new MarginSpec(null, null, minPercent, maxPercent);
  }

  // Get the min pixels, given the [totalPixels].
  getMinPixels(totalPixels: number) {
    if (this._minPixel) {
      assert(this._minPixel < totalPixels);
      return this._minPixel;
    }
    if (this._minPercent) {
      return Math.round(totalPixels * (this._minPercent / 100));
    }
    return 0;
  }

  // Get the max pixels, given the [totalPixels].
  getMaxPixels(totalPixels: number) {
    if (this._maxPixel) {
      assert(this._maxPixel < totalPixels);
      return this._maxPixel;
    }
    if (this._maxPercent) {
      return Math.round(totalPixels * (this._maxPercent / 100));
    }
    return totalPixels;
  }
}
