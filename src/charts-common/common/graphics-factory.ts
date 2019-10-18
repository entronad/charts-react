import { LineStyle } from './line-style';
import { TextElement } from './text-element';
import { TextStyle } from './text-style';

// Interface to native platform graphics functions.
export abstract class GraphicsFactory {
  abstract createLinePaint(): LineStyle;

  // Returns a [TextStyle] object.
  abstract createTextPaint(): TextStyle;

  // Returns a text element from [text] and [style].
  abstract createTextElement(text: string): TextElement;
}
