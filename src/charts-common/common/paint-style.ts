import { Color } from './color';

// Style properties of a paintable object.
export abstract class PaintStyle {
  abstract get color(): Color;

  abstract set color(value: Color);
}
