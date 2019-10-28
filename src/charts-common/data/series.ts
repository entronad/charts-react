import { TextStyleSpec } from '../chart/cartesian/axis/spec/axis-spec';
import { FillPatternType } from '../chart/common/chart-canvas';
import { DomainFormatter, MeasureFormatter } from '../chart/common/datum-details';
import { Color } from '../common/color';
import { TypedRegistry, TypedKey } from '../common/typed-registry';

export class Series<T, D> {
  readonly id: string;
  readonly displayName: string;

  // Overlay series provided supplemental information on a chart, but are not
  // considered to be primary data. They should not be selectable by user
  // interaction.
  readonly overlaySeries: boolean;

  readonly seriesCategory: string;

  // Color which represents the entire series in legends.
  //
  // If this is not provided in the original series object, it will be inferred
  // from the color of the first datum in the series.
  //
  // If this is provided, but no [colorFn] is provided, then it will be treated
  // as the color for each datum in the series.
  //
  // If neither are provided, then the chart will insert colors for each series
  // on the chart using a mapping function.
  readonly seriesColor: Color;

  readonly data: Array<T>;

  // [keyFn] defines a globally unique identifier for each datum.
  //
  // The key for each datum is used during chart animation to smoothly
  // transition data still in the series to its new state.
  //
  // Note: This is currently an optional function that is not fully used by all
  // series renderers yet.
  readonly keyFn: AccessorFn<string>;

  readonly domainFn: AccessorFn<D>;
  readonly domainFormatterFn: AccessorFn<DomainFormatter<D>>;
  readonly domainLowerBoundFn: AccessorFn<D>;
  readonly domainUpperBoundFn: AccessorFn<D>;
  readonly measureFn: AccessorFn<number>;
  readonly measureFormatterFn: AccessorFn<MeasureFormatter>;
  readonly measureLowerBoundFn: AccessorFn<number>;
  readonly measureUpperBoundFn: AccessorFn<number>;
  readonly measureOffsetFn: AccessorFn<number>;

  // [areaColorFn] returns the area color for a given data value. If not
  // provided, then some variation of the main [colorFn] will be used (e.g.
  // 10% opacity).
  //
  // This color is used for supplemental information on the series, such as
  // confidence intervals or area skirts.
  readonly areaColorFn: AccessorFn<Color>;

  // [colorFn] returns the rendered stroke color for a given data value.
  //
  // If this is not provided, then [seriesColor] will be used for every datum.
  //
  // If neither are provided, then the chart will insert colors for each series
  // on the chart using a mapping function.
  readonly colorFn: AccessorFn<Color>;

  // [dashPatternFn] returns the dash pattern for a given data value.
  readonly dashPatternFn: AccessorFn<Array<number>>;

  // [fillColorFn] returns the rendered fill color for a given data value. If
  // not provided, then [colorFn] will be used as a fallback.
  readonly fillColorFn: AccessorFn<Color>;

  // [patternColorFn] returns the background color of tile when a
  // [FillPatternType] beside `solid` is used. If not provided, then
  // background color is used.
  readonly patternColorFn: AccessorFn<Color>;

  readonly fillPatternFn: AccessorFn<FillPatternType>;
  readonly radiusPxFn: AccessorFn<number>;
  readonly strokeWidthPxFn: AccessorFn<number>;
  readonly labelAccessorFn: AccessorFn<string>;
  readonly insideLabelStyleAccessorFn: AccessorFn<TextStyleSpec>;
  readonly outsideLabelStyleAccessorFn: AccessorFn<TextStyleSpec>;

  // TODO: should this be immutable as well? If not, should any of
  // the non-required ones be final?
  readonly attributes = new SeriesAttributes();

  constructor({
    id,
    data,
    domainFn,
    measureFn,
    displayName,
    seriesColor,
    areaColorFn,
    colorFn,
    dashPatternFn,
    domainFormatterFn,
    domainLowerBoundFn,
    domainUpperBoundFn,
    fillColorFn,
    patternColorFn,
    fillPatternFn,
    // keyFn,
    labelAccessorFn,
    insideLabelStyleAccessorFn,
    outsideLabelStyleAccessorFn,
    measureFormatterFn,
    measureLowerBoundFn,
    measureUpperBoundFn,
    measureOffsetFn,
    overlaySeries = false,
    radiusPxFn,
    seriesCategory,
    strokeWidthPxFn,
  }: {
    id: string,
    data: Array<T>,
    domainFn: TypedAccessorFn<T, D>,
    measureFn: TypedAccessorFn<T, number>,
    displayName?: string,
    seriesColor?: Color,
    areaColorFn?: TypedAccessorFn<T, Color>,
    colorFn?: TypedAccessorFn<T, Color>,
    dashPatternFn?: TypedAccessorFn<T, Array<number>>,
    domainFormatterFn?: TypedAccessorFn<T, DomainFormatter<D>>,
    domainLowerBoundFn?: TypedAccessorFn<T, D>,
    domainUpperBoundFn?: TypedAccessorFn<T, D>,
    fillColorFn?: TypedAccessorFn<T, Color>,
    patternColorFn?: TypedAccessorFn<T, Color>,
    fillPatternFn?: TypedAccessorFn<T, FillPatternType>,
    keyFn?: TypedAccessorFn<T, string>,
    labelAccessorFn?: TypedAccessorFn<T, string>,
    insideLabelStyleAccessorFn?: TypedAccessorFn<T, TextStyleSpec>,
    outsideLabelStyleAccessorFn?: TypedAccessorFn<T, TextStyleSpec>,
    measureFormatterFn?: TypedAccessorFn<T, MeasureFormatter>,
    measureLowerBoundFn?: TypedAccessorFn<T, number>,
    measureUpperBoundFn?: TypedAccessorFn<T, number>,
    measureOffsetFn?: TypedAccessorFn<T, number>,
    overlaySeries?: boolean,
    radiusPxFn?: TypedAccessorFn<T, number>,
    seriesCategory?: string,
    strokeWidthPxFn?: TypedAccessorFn<T, number>,
  }) {
    // Wrap typed accessors.
    const _domainFn = (index: number) => domainFn(data[index], index);
    const _measureFn = (index: number) => measureFn(data[index], index);
    const _areaColorFn = areaColorFn == null
      ? null
      : (index: number) => areaColorFn(data[index], index);
    const _colorFn =
        colorFn == null ? null : (index: number) => colorFn(data[index], index);
    const _dashPatternFn = dashPatternFn == null
      ? null
      : (index: number) => dashPatternFn(data[index], index);
    const _domainFormatterFn = domainFormatterFn == null
      ? null
      : (index: number) => domainFormatterFn(data[index], index);
    const _domainLowerBoundFn = domainLowerBoundFn == null
      ? null
      : (index: number) => domainLowerBoundFn(data[index], index);
    const _domainUpperBoundFn = domainUpperBoundFn == null
      ? null
      : (index: number) => domainUpperBoundFn(data[index], index);
    const _fillColorFn = fillColorFn == null
      ? null
      : (index: number) => fillColorFn(data[index], index);
    const _patternColorFn = patternColorFn == null
      ? null
      : (index: number) => patternColorFn(data[index], index);
    const _fillPatternFn = fillPatternFn == null
      ? null
      : (index: number) => fillPatternFn(data[index], index);
    const _labelAccessorFn = labelAccessorFn == null
      ? null
      : (index: number) => labelAccessorFn(data[index], index);
    const _insideLabelStyleAccessorFn = insideLabelStyleAccessorFn == null
      ? null
      : (index: number) => insideLabelStyleAccessorFn(data[index], index);
    const _outsideLabelStyleAccessorFn = outsideLabelStyleAccessorFn == null
      ? null
      : (index: number) => outsideLabelStyleAccessorFn(data[index], index);
    const _measureFormatterFn = measureFormatterFn == null
      ? null
      : (index: number) => measureFormatterFn(data[index], index);
    const _measureLowerBoundFn = measureLowerBoundFn == null
      ? null
      : (index: number) => measureLowerBoundFn(data[index], index);
    const _measureUpperBoundFn = measureUpperBoundFn == null
      ? null
      : (index: number) => measureUpperBoundFn(data[index], index);
    const _measureOffsetFn = measureOffsetFn == null
      ? null
      : (index: number) => measureOffsetFn(data[index], index);
    const _radiusPxFn = radiusPxFn == null
      ? null
      : (index: number) => radiusPxFn(data[index], index);
    const _strokeWidthPxFn = strokeWidthPxFn == null
      ? null
      : (index: number) => strokeWidthPxFn(data[index], index);
    
    this.id = id;
    this.data = data;
    this.domainFn = _domainFn;
    this.measureFn = _measureFn;
    this.displayName = displayName;
    this.areaColorFn = _areaColorFn;
    this.colorFn = _colorFn;
    this.dashPatternFn = _dashPatternFn;
    this.domainFormatterFn = _domainFormatterFn;
    this.domainLowerBoundFn = _domainLowerBoundFn;
    this.domainUpperBoundFn = _domainUpperBoundFn;
    this.fillColorFn = _fillColorFn;
    this.fillPatternFn = _fillPatternFn;
    this.patternColorFn = _patternColorFn;
    this.labelAccessorFn = _labelAccessorFn;
    this.insideLabelStyleAccessorFn = _insideLabelStyleAccessorFn;
    this.outsideLabelStyleAccessorFn = _outsideLabelStyleAccessorFn;
    this.measureFormatterFn = _measureFormatterFn;
    this.measureLowerBoundFn = _measureLowerBoundFn;
    this.measureUpperBoundFn = _measureUpperBoundFn;
    this.measureOffsetFn = _measureOffsetFn;
    this.overlaySeries = overlaySeries;
    this.radiusPxFn = _radiusPxFn;
    this.seriesCategory = seriesCategory;
    this.seriesColor = seriesColor;
    this.strokeWidthPxFn = _strokeWidthPxFn;
  }

  setAttribute = <R>(key: AttributeKey<R>, value: R) => {
    this.attributes.setAttr(key, value);
  };

  getAttribute = <R>(key: AttributeKey<R>) =>
    this.attributes.getAttr<R>(key);
}

// Computed property on series.
//
// If the [index] argument is `null`, the accessor is asked to provide a
// property of [series] as a whole. Accessors are not required to support
// such usage.
//
// Otherwise, [index] must be a valid subscript into a list of `series.length`.
export interface AccessorFn<R> {
  (index: number): R;
}

export interface TypedAccessorFn<T, R> {
  (datum: T, index: number): R;
}

export class AttributeKey<R> extends TypedKey<R> {}

export class SeriesAttributes extends TypedRegistry {}
