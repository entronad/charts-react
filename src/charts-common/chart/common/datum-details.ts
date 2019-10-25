import { Point } from 'package:dart/math';

import { Color } from '../../common/color';
import { SymbolRenderer } from '../../common/symbol-renderer';
import { ImmutableSeries } from './processed-series';

export interface DomainFormatter<D> {
  (domain: D): string;
}
export interface MeasureFormatter {
  (measure: number): string;
}

// Represents processed rendering details for a data point from a series.
export class DatumDetails<D> {
  readonly datum: any;

  // The index of the datum in the series.
  readonly index: number;

  // Domain value of [datum].
  readonly domain: D;

  // Domain lower bound value of [datum]. This may represent an error bound, or
  // a previous domain value.
  readonly domainLowerBound: D;

  // Domain upper bound value of [datum]. This may represent an error bound, or
  // a target domain value.
  readonly domainUpperBound: D;

  // Measure value of [datum].
  readonly measure: number;

  // Measure lower bound value of [datum]. This may represent an error bound,
  // or a previous value.
  readonly measureLowerBound: number;

  // Measure upper bound value of [datum]. This may represent an error bound,
  // or a target measure value.
  readonly measureUpperBound: number;

  // Measure offset value of [datum].
  readonly measureOffset: number;

  // Original measure value of [datum]. This may differ from [measure] if a
  // behavior attached to a chart automatically adjusts measure values.
  readonly rawMeasure: number;

  // Original measure lower bound value of [datum]. This may differ from
  // [measureLowerBound] if a behavior attached to a chart automatically
  // adjusts measure values.
  readonly rawMeasureLowerBound: number;

  // Original measure upper bound value of [datum]. This may differ from
  // [measureUpperBound] if a behavior attached to a chart automatically
  // adjusts measure values.
  readonly rawMeasureUpperBound: number;

  // The series the [datum] is from.
  readonly series: ImmutableSeries<D>;

  // The color of this [datum].
  readonly color: Color;

  // Optional fill color of this [datum].
  //
  // If this is defined, then [color] will be used as a stroke color.
  // Otherwise, [color] will be used for the fill color.
  readonly fillColor: Color;

  // Optional area color of this [datum].
  //
  // This color is used for supplemental information on the series, such as
  // confidence intervals or area skirts. If not provided, then some variation
  // of the main [color] will be used (e.g. 10% opacity).
  readonly areaColor: Color;

  // Optional dash pattern of this [datum].
  readonly dashPattern: Array<number>;

  // The chart position of the (domain, measure) for the [datum] from a
  // renderer.
  readonly chartPosition: Point;

  // The chart position of the (domainLowerBound, measureLowerBound) for the
  // [datum] from a renderer.
  readonly chartPositionLower: Point;

  // The chart position of the (domainUpperBound, measureUpperBound) for the
  // [datum] from a renderer.
  readonly chartPositionUpper: Point;

  // Distance of [domain] from a given (x, y) coordinate.
  readonly domainDistance: number;

  // Distance of [measure] from a given (x, y) coordinate.
  readonly measureDistance: number;

  // Relative Cartesian distance of ([domain], [measure]) from a given (x, y)
  // coordinate.
  readonly relativeDistance: number;

  // The radius of this [datum].
  readonly radiusPx: number;

  // Renderer used to draw the shape of this datum.
  //
  // This is primarily used for point shapes on line and scatter plot charts.
  readonly symbolRenderer: SymbolRenderer;

  // The stroke width of this [datum].
  readonly strokeWidthPx: number;

  // Optional formatter for [domain].
  domainFormatter: DomainFormatter<D>;

  // Optional formatter for [measure].
  measureFormatter: MeasureFormatter;

  constructor({
    datum,
    index,
    domain,
    domainFormatter,
    domainLowerBound,
    domainUpperBound,
    measure,
    measureFormatter,
    measureLowerBound,
    measureUpperBound,
    measureOffset,
    rawMeasure,
    rawMeasureLowerBound,
    rawMeasureUpperBound,
    series,
    color,
    fillColor,
    areaColor,
    dashPattern,
    chartPosition,
    chartPositionLower,
    chartPositionUpper,
    domainDistance,
    measureDistance,
    relativeDistance,
    radiusPx,
    symbolRenderer,
    strokeWidthPx,
  }: {
    datum?: any;
    index?: number;
    domain?: D;
    domainFormatter?: DomainFormatter<D>;
    domainLowerBound?: D;
    domainUpperBound?: D;
    measure?: number;
    measureFormatter?: MeasureFormatter;
    measureLowerBound?: number;
    measureUpperBound?: number;
    measureOffset?: number;
    rawMeasure?: number;
    rawMeasureLowerBound?: number;
    rawMeasureUpperBound?: number;
    series?: ImmutableSeries<D>;
    color?: Color;
    fillColor?: Color;
    areaColor?: Color;
    dashPattern?: Array<number>;
    chartPosition?: Point;
    chartPositionLower?: Point;
    chartPositionUpper?: Point;
    domainDistance?: number;
    measureDistance?: number;
    relativeDistance?: number;
    radiusPx?: number;
    symbolRenderer?: SymbolRenderer;
    strokeWidthPx?: number;
  } = {}) {
    this.datum = datum;
    this.index = index;
    this.domain = domain;
    this.domainFormatter = domainFormatter;
    this.domainLowerBound = domainLowerBound;
    this.domainUpperBound = domainUpperBound;
    this.measure = measure;
    this.measureFormatter = measureFormatter;
    this.measureLowerBound = measureLowerBound;
    this.measureUpperBound = measureUpperBound;
    this.measureOffset = measureOffset;
    this.rawMeasure = rawMeasure;
    this.rawMeasureLowerBound = rawMeasureLowerBound;
    this.rawMeasureUpperBound = rawMeasureUpperBound;
    this.series = series;
    this.color = color;
    this.fillColor = fillColor;
    this.areaColor = areaColor;
    this.dashPattern = dashPattern;
    this.chartPosition = chartPosition;
    this.chartPositionLower = chartPositionLower;
    this.chartPositionUpper = chartPositionUpper;
    this.domainDistance = domainDistance;
    this.measureDistance = measureDistance;
    this.relativeDistance = relativeDistance;
    this.radiusPx = radiusPx;
    this.symbolRenderer = symbolRenderer;
    this.strokeWidthPx = strokeWidthPx;
  }

  static from = <D>(other: DatumDetails<D>, {
    datum,
    index,
    domain,
    domainFormatter,
    domainLowerBound,
    domainUpperBound,
    measure,
    measureFormatter,
    measureLowerBound,
    measureUpperBound,
    measureOffset,
    rawMeasure,
    rawMeasureLowerBound,
    rawMeasureUpperBound,
    series,
    color,
    fillColor,
    areaColor,
    dashPattern,
    chartPosition,
    chartPositionLower,
    chartPositionUpper,
    domainDistance,
    measureDistance,
    relativeDistance,
    radiusPx,
    symbolRenderer,
    strokeWidthPx,
  }: {
    datum?: any;
    index?: number;
    domain?: D;
    domainFormatter?: DomainFormatter<D>;
    domainLowerBound?: D;
    domainUpperBound?: D;
    measure?: number;
    measureFormatter?: MeasureFormatter;
    measureLowerBound?: number;
    measureUpperBound?: number;
    measureOffset?: number;
    rawMeasure?: number;
    rawMeasureLowerBound?: number;
    rawMeasureUpperBound?: number;
    series?: ImmutableSeries<D>;
    color?: Color;
    fillColor?: Color;
    areaColor?: Color;
    dashPattern?: Array<number>;
    chartPosition?: Point;
    chartPositionLower?: Point;
    chartPositionUpper?: Point;
    domainDistance?: number;
    measureDistance?: number;
    relativeDistance?: number;
    radiusPx?: number;
    symbolRenderer?: SymbolRenderer;
    strokeWidthPx?: number;
  } = {}) => new DatumDetails<D>({
    datum: datum || other.datum,
    index: index || other.index,
    domain: domain || other.domain,
    domainFormatter: domainFormatter || other.domainFormatter,
    domainLowerBound: domainLowerBound || other.domainLowerBound,
    domainUpperBound: domainUpperBound || other.domainUpperBound,
    measure: measure || other.measure,
    measureFormatter: measureFormatter || other.measureFormatter,
    measureLowerBound: measureLowerBound || other.measureLowerBound,
    measureUpperBound: measureUpperBound || other.measureUpperBound,
    measureOffset: measureOffset || other.measureOffset,
    rawMeasure: rawMeasure || other.rawMeasure,
    rawMeasureLowerBound: rawMeasureLowerBound || other.rawMeasureLowerBound,
    rawMeasureUpperBound: rawMeasureUpperBound || other.rawMeasureUpperBound,
    series: series || other.series,
    color: color || other.color,
    fillColor: fillColor || other.fillColor,
    areaColor: areaColor || other.areaColor,
    dashPattern: dashPattern || other.dashPattern,
    chartPosition: chartPosition || other.chartPosition,
    chartPositionLower: chartPositionLower || other.chartPositionLower,
    chartPositionUpper: chartPositionUpper || other.chartPositionUpper,
    domainDistance: domainDistance || other.domainDistance,
    measureDistance: measureDistance || other.measureDistance,
    relativeDistance: relativeDistance || other.relativeDistance,
    radiusPx: radiusPx || other.radiusPx,
    symbolRenderer: symbolRenderer || other.symbolRenderer,
    strokeWidthPx: strokeWidthPx || other.strokeWidthPx,
  });
}
