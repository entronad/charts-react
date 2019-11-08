import { ImmutableSeries } from './processed-series';

// Stores datum and the series the datum originated.
export class SeriesDatum<D> {
  readonly series: ImmutableSeries<D>;
  readonly datum: any;
  _index: number;

  constructor(series: ImmutableSeries<D>, datum: any) {
    this.series = series;
    this.datum = datum;

    this._index = datum == null ? null : series.data.indexOf(datum);
  }

  get index() {
    return this._index;
  }

  equals = (other: any) =>
    (other instanceof SeriesDatum &&
    other.series === this.series &&
    other.datum === this.datum);
}

// Represents a series datum based on series id and datum index.
export class SeriesDatumConfig<D> {
  readonly seriesId: string;
  readonly domainValue: D;

  constructor(seriesId: string, domainValue: D) {
    this.seriesId = seriesId;
    this.domainValue = domainValue;
  }

  equals = (other: any) =>
    (other instanceof SeriesDatumConfig &&
    other.seriesId === this.seriesId &&
    other.domainValue === this.domainValue);
}
