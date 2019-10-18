import { PaintStyle } from './paint-style';

// Paint properties of a text.
export abstract class TextStyle extends PaintStyle {
  abstract get fontSize(): number;
  abstract set fontSize(value: number);

  abstract get fontFamily(): string;
  abstract set fontFamily(fontFamily: string);

  abstract get lineHeight(): number;
  abstract set lineHeight(value: number);
}