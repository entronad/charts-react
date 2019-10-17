import { assert } from 'package:dart/assert';

export class Color {
  static readonly black = new Color({ r: 0, g: 0, b: 0 });
  static readonly white = new Color({ r: 255, g: 255, b: 255 });
  static readonly transparent = new Color({ r: 0, g: 0, b: 0, a: 0 });

  static readonly _darkerPercentOfOrig = 0.7;
  static readonly _lighterPercentOfOrig = 0.1;

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
  }) => new Color({
    r: color.r,
    g: color.g,
    b: color.b,
    a: color.a,
    darker,
    lighter,
  });

  // Construct the color from a hex code string, of the format #RRGGBB.
  static fromHex = (code: string) => {
    const str = code.slice(1, 7);
    const bigint = parseInt(str, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const a = 255;
    return new Color({ r, g, b, a });
  };

  get darker() {
    return this._darker || new Color({
      r: Math.round(this.r * Color._darkerPercentOfOrig),
      g: Math.round(this.g * Color._darkerPercentOfOrig),
      b: Math.round(this.b * Color._darkerPercentOfOrig),
      a: this.a,
    });
  }

  get lighter() {
    return this._lighter || new Color({
      r: Math.round(this.r * Color._lighterPercentOfOrig),
      g: Math.round(this.g * Color._lighterPercentOfOrig),
      b: Math.round(this.b * Color._lighterPercentOfOrig),
      a: this.a,
    });
  }

  toString = () => this.rgbaHexString;

  // Converts the character into a #RGBA hex string.
  get rgbaHexString() {
    return `#${this._get2CharHex(this.r)}${this._get2CharHex(this.g)}${this._get2CharHex(this.b)}${this._get2CharHex(this.a)}`;
  }

  // Converts the character into a #RGB hex string.
  get hexString() {
    // Alpha is not included in the hex string.
    assert(this.a === 255);
    return `#${this._get2CharHex(this.r)}${this._get2CharHex(this.g)}${this._get2CharHex(this.b)}`;
  }

  _get2CharHex = (num: number) => {
    let str = num.toString(16);
    while (str.length < 2) {
      str = `0${str}`;
    }
    return str;
  }
}
