import { Color } from '../../common/color';
import { DomainFormatter, MeasureFormatter } from './datum-details';
import { AccessorFn, Series, SeriesAttributes, AttributeKey } from '../../data/series';
import { Axis } from '../cartesian/axis/axis';
import { TextStyleSpec } from '../cartesian/axis/spec/axis-spec';
import { FillPatternType } from './chart-canvas';

export abstract class ImmutableSeries<D> {
  abstract get id(): String;

  abstract get displayName(): String;

  /// Overlay series provided supplemental information on a chart, but are not
  /// considered to be primary data. They should not be selectable by user
  /// interaction.
  abstract get overlaySeries(): boolean;

  abstract get seriesCategory(): String;

  /// Color which represents the entire series in legends.
  ///
  /// If this is not provided in the original series object, it will be inferred
  /// from the color of the first datum in the series.
  ///
  /// If this is provided, but no [colorFn] is provided, then it will be treated
  /// as the color for each datum in the series.
  ///
  /// If neither are provided, then the chart will insert colors for each series
  /// on the chart using a mapping function.
  abstract get seriesColor(): Color;

  abstract get seriesIndex(): number;

  /// Sum of the measure values for the series.
  abstract get seriesMeasureTotal(): number;

  abstract get data(): Array<any>;

  /// [keyFn] defines a globally unique identifier for each datum.
  ///
  /// The key for each datum is used during chart animation to smoothly
  /// transition data still in the series to its new state.
  ///
  /// Note: This is currently an optional function that is not fully used by all
  /// series renderers yet.
  abstract keyFn(): AccessorFn<String>;

  abstract get domainFn(): AccessorFn<D>;

  abstract get domainFormatterFn(): AccessorFn<DomainFormatter<D>>;

  abstract get domainLowerBoundFn(): AccessorFn<D>;

  abstract get domainUpperBoundFn(): AccessorFn<D>;

  abstract get measureFn(): AccessorFn<number>;

  abstract get measureFormatterFn(): AccessorFn<MeasureFormatter>;

  abstract get measureLowerBoundFn(): AccessorFn<number>;

  abstract get measureUpperBoundFn(): AccessorFn<number>;

  abstract get measureOffsetFn(): AccessorFn<number>;

  abstract get rawMeasureFn(): AccessorFn<number>;

  abstract get rawMeasureLowerBoundFn(): AccessorFn<number>;

  abstract get rawMeasureUpperBoundFn(): AccessorFn<number>;

  abstract get areaColorFn(): AccessorFn<Color>;

  abstract get colorFn(): AccessorFn<Color>;

  abstract get dashPatternFn(): AccessorFn<Array<number>>;

  abstract get fillColorFn(): AccessorFn<Color>;

  abstract get patternColorFn(): AccessorFn<Color>;

  abstract get fillPatternFn(): AccessorFn<FillPatternType>;

  abstract get labelAccessorFn(): AccessorFn<String>;

  abstract insideLabelStyleAccessorFn(): AccessorFn<TextStyleSpec>;
  abstract outsideLabelStyleAccessorFn(): AccessorFn<TextStyleSpec>;

  abstract get radiusPxFn(): AccessorFn<number>;

  abstract get strokeWidthPxFn(): AccessorFn<number>;

  abstract setAttr
}
