export class Color {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;

  readonly _darker: Color;
  readonly _lighter: Color;

  constructor({
    r,
    g,
    b,
    a = 255,
    darker,
    lighter,
  }: {
    r?: number,
    g?: number,
    b?: number,
    a?: number,
    darker?: Color,
    lighter?: Color,
  }) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this._darker = darker;
    this._lighter = lighter;
  }

  static fromOther = ({
    color,
    darker,
    lighter,
  }: {
    color?: Color,
    darker?: Color,
    lighter?: Color,
  }) => new Color({});
}
