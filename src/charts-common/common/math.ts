import vec2 from 'gl-matrix/src/gl-matrix/vec2';

/// Takes a number and clamps it to within the provided bounds.
///
/// Returns the input number if it is within bounds, or the nearest number
/// within the bounds.
///
/// [value] The input number.
/// [minValue] The minimum value to return.
/// [maxValue] The maximum value to return.
export const clamp = (value: number, minValue: number, maxValue: number) =>
  Math.min(Math.max(value, minValue), maxValue);

/// Returns the minimum distance between point p and the line segment vw.
///
/// [p] The point.
/// [v] Start point for the line segment.
/// [w] End point for the line segment.
export const distanceBetweenPointAndLineSegment

/// Returns the squared minimum distance between point p and the line segment
/// vw.
///
/// [p] The point.
/// [v] Start point for the line segment.
/// [w] End point for the line segment.
export const distanceBetweenPointAndLineSegmentSquared = (p: vec2, v: vec2, w: vec2) => {
  const lineLength = vec2.sqrDist(v, w);

  if (lineLength === 0) {
    return vec2.sqrDist(p, v);
  }


  let t0 = vec2.dot(vec2.sub(vec2.create(), p, v), vec2.sub(vec2.create(), w, v))
}