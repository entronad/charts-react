// A utility class for representing two-dimensional positions.
export class Point {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString = () => `Point(${this.x}, ${this.y})`;

  // Get the straight line (Euclidean) distance between the origin (0, 0) and
  // this point.
  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // Returns the distance between `this` and [other].
  distanceTo = (other: Point) => {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Returns the squared distance between `this` and [other].
  //
  // Squared distances can be used for comparisons when the actual value is not
  // required.
  squaredDistanceTo = (other: Point) => {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return dx * dx + dy * dy;
  };
}
