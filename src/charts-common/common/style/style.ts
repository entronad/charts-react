import { LineStyleSpec } from '../../chart/cartesian/axis/spec/axis-spec';
import { Color } from '../color';
import { GraphicsFactory } from '../graphics-factory';
import { LineStyle } from '../line-style';
import { Palette } from '../palette';

// TODO: Implementation of style will change drastically, see bug
// for more details. This is an intermediate step in order to allow overriding
// the default style using style factory.

// A set of styling rules that determines the default look and feel of charts.
//
// Get or set the [Style] that is used for the app using [StyleFactory.style].
export abstract class Style {
  abstract get black(): Color;

  abstract get transparent(): Color;

  abstract get white(): Color;

  // Gets list with [count] of palettes.
  abstract getOrderedPalettes(count: number): Array<Palette>;

  // Creates [LineStyleSpec] for axis line from spec.
  //
  // Fill missing value(s) with default.
  abstract createAxisLineStyle(
    graphicFactory: GraphicsFactory,
    spec: LineStyleSpec,
  ): LineStyle;

  // Creates [LineStyleSpec] for tick lines from spec.
  //
  // Fill missing value(s) with default.
  abstract createTickLineStyle(
    graphicFactory: GraphicsFactory,
    spec: LineStyleSpec,
  ): LineStyle;

  // Default tick length.
  abstract get tickLength(): number;

  // Default tick color.
  abstract get tickColor(): Color;

  //
  // Creates [LineStyle] for axis gridlines from spec.
  //
  // Fill missing value(s) with default.
  abstract createGridlineStyle(
    graphicFactory: GraphicsFactory,
    spec: LineStyleSpec,
  ): LineStyle;

  // Default color for outside label leader lines for [ArcLabelDecorator].
  abstract get arcLabelOutsideLeaderLine(): Color;

  // Default series color for legends, used as a fallback when a series has no
  // data.
  abstract get defaultSeriesColor(): Color;

  // Default color for strokes for [ArcRendererConfig].
  abstract get arcStrokeColor(): Color;

  // Default color for entry text for [Legend].
  abstract get legendEntryTextColor(): Color;

  // Default color for title text for [Legend].
  abstract get legendTitleTextColor(): Color;

  // Default color for [LinePointHighlighter].
  abstract get linePointHighlighterColor(): Color;

  // Default color for "no data" states on charts.
  abstract get noDataColor(): Color;

  // Default color for [RangeAnnotation].
  abstract get rangeAnnotationColor(): Color;

  // Default fill color for [Slider].
  abstract get sliderFillColor(): Color;

  // Default stroke color for [Slider].
  abstract get sliderStrokeColor(): Color;

  // Default background color for the chart.
  abstract get chartBackgroundColor(): Color;

  // The width of the band specified as fraction of step.
  abstract get rangeBandSize(): number;
}
