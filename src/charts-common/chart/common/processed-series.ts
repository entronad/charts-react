import { Color } from '../../common/color';
import { DomainFormatter, MeasureFormatter } from './datum-details';
import { AccessorFn, Series, SeriesAttributes, AttributeKey } from '../../data/series';
import { Axis } from '../cartesian/axis/axis';
import { TextStyleSpec } from '../cartesian/axis/spec/axis-spec';
import { FillPatternType } from './chart-canvas';

export abstract class ImmutableSeries<D> {
  abstract get id(): string;

  abstract get displayName(): string;

  // Overlay series provided supplemental information on a chart, but are not
  // considered to be primary data. They should not be selectable by user
  // interaction.
  abstract get overlaySeries(): boolean;

  abstract get seriesCategory(): string;

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
  abstract get seriesColor(): Color;

  abstract get seriesIndex(): number;

  // Sum of the measure values for the series.
  abstract get seriesMeasureTotal(): number;

  abstract get data(): Array<any>;

  // [keyFn] defines a globally unique identifier for each datum.
  //
  // The key for each datum is used during chart animation to smoothly
  // transition data still in the series to its new state.
  //
  // Note: This is currently an optional function that is not fully used by all
  // series renderers yet.
  abstract keyFn: AccessorFn<string>;

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

  abstract get labelAccessorFn(): AccessorFn<string>;

  abstract insideLabelStyleAccessorFn: AccessorFn<TextStyleSpec>;
  abstract outsideLabelStyleAccessorFn: AccessorFn<TextStyleSpec>;

  abstract get radiusPxFn(): AccessorFn<number>;

  abstract get strokeWidthPxFn(): AccessorFn<number>;

  abstract setAttr<R>(key: AttributeKey<R>, value: R): void;

  abstract getAttr<R>(key: AttributeKey<R>): R;
}

export class MutableSeries<D> extends ImmutableSeries<D> {
  readonly id: string;
  displayName: string;
  overlaySeries: boolean;
  seriesCategory: string;
  seriesColor: Color;
  seriesIndex: number;

  // Sum of the measure values for the series.
  seriesMeasureTotal: number;

  data: Array<any>;

  keyFn: AccessorFn<string>;

  domainFn: AccessorFn<D>;
  domainFormatterFn: AccessorFn<DomainFormatter<D>>;
  domainLowerBoundFn: AccessorFn<D>;
  domainUpperBoundFn: AccessorFn<D>;
  measureFn: AccessorFn<number>;
  measureFormatterFn: AccessorFn<MeasureFormatter>;
  measureLowerBoundFn: AccessorFn<number>;
  measureUpperBoundFn: AccessorFn<number>;
  measureOffsetFn: AccessorFn<number>;
  rawMeasureFn: AccessorFn<number>;
  rawMeasureLowerBoundFn: AccessorFn<number>;
  rawMeasureUpperBoundFn: AccessorFn<number>;

  areaColorFn: AccessorFn<Color>;
  colorFn: AccessorFn<Color>;
  dashPatternFn: AccessorFn<Array<number>>;
  fillColorFn: AccessorFn<Color>;
  fillPatternFn: AccessorFn<FillPatternType>;
  patternColorFn: AccessorFn<Color>;
  radiusPxFn: AccessorFn<number>;
  strokeWidthPxFn: AccessorFn<number>;
  labelAccessorFn: AccessorFn<string>;
  insideLabelStyleAccessorFn: AccessorFn<TextStyleSpec>;
  outsideLabelStyleAccessorFn: AccessorFn<TextStyleSpec>;

  readonly _attrs = new SeriesAttributes();

  measureAxis: Axis<any>;
  domainAxis: Axis<any>;

  constructor(series: Series<any, D>) {
    super();
    this.id = series.id;

    this.displayName = series.displayName ?? series.id;
    this.overlaySeries = series.overlaySeries;
    this.seriesCategory = series.seriesCategory;
    this.seriesColor = series.seriesColor;

    this.data = series.data;
    this.keyFn = series.keyFn;

    this.domainFn = series.domainFn;
    this.domainLowerBoundFn = series.domainLowerBoundFn;
    this.domainUpperBoundFn = series.domainUpperBoundFn;

    this.measureFn = series.measureFn;
    this.measureFormatterFn = series.measureFormatterFn;
    this.measureLowerBoundFn = series.measureLowerBoundFn;
    this.measureUpperBoundFn = series.measureUpperBoundFn;
    this.measureOffsetFn = series.measureOffsetFn;

    // Save the original measure functions in case they get replaced later.
    this.rawMeasureFn = series.measureFn;
    this.rawMeasureLowerBoundFn = series.measureLowerBoundFn;
    this.rawMeasureUpperBoundFn = series.measureUpperBoundFn;

    // Pre-compute the sum of the measure values to make it available on demand.
    this.seriesMeasureTotal = 0;
    for (let i = 0; i < this.data.length; i++) {
      const measure = this.measureFn(i);
      if (measure != null) {
        this.seriesMeasureTotal += measure;
      }
    }

    this.areaColorFn = series.areaColorFn;
    this.colorFn = series.colorFn;
    this.dashPatternFn = series.dashPatternFn;
    this.fillColorFn = series.fillColorFn;
    this.fillPatternFn = series.fillPatternFn;
    this.patternColorFn = series.patternColorFn;
    this.labelAccessorFn = series.labelAccessorFn ?? ((i) => this.domainFn(i).toString());
    this.insideLabelStyleAccessorFn = series.insideLabelStyleAccessorFn;
    this.outsideLabelStyleAccessorFn = series.outsideLabelStyleAccessorFn;

    this.radiusPxFn = series.radiusPxFn;
    this.strokeWidthPxFn = series.strokeWidthPxFn;

    this._attrs.mergeFrom(series.attributes);
  }

  static clone = <D>(other: MutableSeries<D>) => {
    const rst = new MutableSeries<D>(new Series({
      id: other.id,
      data: other.data,
      domainFn: other.domainFn,
      measureFn: other.measureFn,
    }));

    rst.displayName = other.displayName;
    rst.overlaySeries = other.overlaySeries;
    rst.seriesCategory = other.seriesCategory;
    rst.seriesColor = other.seriesColor;
    rst.seriesIndex = other.seriesIndex;

    rst.keyFn = other.keyFn;

    rst.domainLowerBoundFn = other.domainLowerBoundFn;
    rst.domainUpperBoundFn = other.domainUpperBoundFn;

    rst.measureFormatterFn = other.measureFormatterFn;
    rst.measureLowerBoundFn = other.measureLowerBoundFn;
    rst.measureUpperBoundFn = other.measureUpperBoundFn;
    rst.measureOffsetFn = other.measureOffsetFn;

    rst.rawMeasureFn = other.rawMeasureFn;
    rst.rawMeasureLowerBoundFn = other.rawMeasureLowerBoundFn;
    rst.rawMeasureUpperBoundFn = other.rawMeasureUpperBoundFn;

    rst.seriesMeasureTotal = other.seriesMeasureTotal;

    rst.areaColorFn = other.areaColorFn;
    rst.colorFn = other.colorFn;
    rst.dashPatternFn = other.dashPatternFn;
    rst.fillColorFn = other.fillColorFn;
    rst.fillPatternFn = other.fillPatternFn;
    rst.patternColorFn = other.patternColorFn;
    rst.labelAccessorFn = other.labelAccessorFn;
    rst.insideLabelStyleAccessorFn = other.insideLabelStyleAccessorFn;
    rst.outsideLabelStyleAccessorFn = other.outsideLabelStyleAccessorFn;
    rst.radiusPxFn = other.radiusPxFn;
    rst.strokeWidthPxFn = other.strokeWidthPxFn;

    rst._attrs.mergeFrom(other._attrs);
    rst.measureAxis = other.measureAxis;
    rst.domainAxis = other.domainAxis;

    return rst;
  }

  getAttr = <R>(key: AttributeKey<R>) =>
    this._attrs.getAttr<R>(key);

  setAttr = <R>(key: AttributeKey<R>, value: R) => {
    this._attrs.setAttr(key, value);
  };

  equals = (other: any) =>
    (other instanceof MutableSeries &&
    this.data === other.data &&
    this.id === other.id);
}
