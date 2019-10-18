import { TextMeasurement } from './text-measurement';
import { TextStyle } from './text-style';

// Interface for accessing text measurement and painter.
export abstract class TextElement {
  // The [TextStyle] of this [TextElement].
  abstract get textStyle(): TextStyle;

  abstract set textStyle(value: TextStyle);

  // The max width of this [TextElement] during measure and layout.
  //
  // If the text exceeds maxWidth, the [maxWidthStrategy] is used.
  abstract get maxWidth(): number;

  abstract set maxWidth(value: number);

  // The strategy to use if this [TextElement] exceeds the [maxWidth].
  abstract get maxWidthStrategy(): MaxWidthStrategy;

  abstract set maxWidthStrategy(maxWidthStrategy: MaxWidthStrategy);

  // The opacity of this element, in addition to the alpha set on the color
  // of this element.
  abstract set opacity(opacity: number);

  // The text of this [TextElement].
  abstract get text(): string;

  // The [TextMeasurement] of this [TextElement] as an approximate of what
  // is actually printed.
  //
  // Will return the [maxWidth] if set and the actual text width is larger.
  abstract get measurement(): TextMeasurement;

  // The direction to render the text relative to the coordinate.
  abstract get textDirection(): TextDirection;
  abstract set textDirection(direction: TextDirection);

  // Return true if settings are all the same.
  //
  // Purposely excludes measurement because the measurement will request the
  // native [TextElement] to layout, which is expensive. We want to avoid the
  // layout by comparing with another [TextElement] to see if they have the
  // same settings.
  static elementSettingsSame = (a: TextElement, b: TextElement) =>
    (a.textStyle === b.textStyle &&
    a.maxWidth === b.maxWidth &&
    a.maxWidthStrategy === b.maxWidthStrategy &&
    a.text === b.text &&
    a.textDirection === b.textDirection);
}

export enum TextDirection {
  ltr,
  rtl,
  center,
}

// The strategy to use if a [TextElement] exceeds the [maxWidth].
export enum MaxWidthStrategy {
  truncate,
  ellipsize,
}
