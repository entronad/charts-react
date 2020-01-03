import { ImmutableSeries } from '../processed-series';
import { SeriesDatum, SeriesDatumConfig } from '../series-datum';

/// Holds the state of interaction or selection for the chart to coordinate
/// between various event sources and things that wish to act upon the selection
/// state (highlight, drill, etc).
///
/// There is one instance per interaction type (ex: info, action) with each
/// maintaining their own state. Info is typically used to update a hover/touch
/// card while action is used in case of a secondary selection/action.
///
/// The series selection state is kept separate from datum selection state to
/// allow more complex highlighting. For example: a Hovercard that shows entries
/// for each datum for a given domain/time, but highlights the closest entry to
/// match up with highlighting/bolding of the line and legend.
export class SelectionModel<D> {
  _selectedDatum: Array<SeriesDatum<D>> = [];
  _selectedSeries: Array<ImmutableSeries<D>> = [];

  /// Create selection model with the desired selection.
  constructor({
    selectedData,
    selectedSeries,
  }: {
    selectedData?: Array<SeriesDatum<D>>,
    selectedSeries?: Array<ImmutableSeries<D>>,
  } = {}) {
    if (selectedData != null) {
      this._selectedDatum = selectedData;
    }
    if (selectedSeries != null) {
      this._selectedSeries = selectedSeries;
    }
  }

  /// Create a deep copy of the selection model.
  static fromOther = <D>(other: SelectionModel<D>) =>
    new SelectionModel<D>({
      selectedData: [...other._selectedDatum],
      selectedSeries: [...other._selectedSeries],
    });

  /// Create selection model from configuration.
  static fromConfig = <D>(
    selectedDataConfig: Array<SeriesDatumConfig<any>>,
    selectedSeriesConfig: Array<string>,
    seriesList: Array<ImmutableSeries<D>>,
  ) => {
    const rst = new SelectionModel<D>();

    const selectedDataMap = new Map<string, Array<D>>();

    if (selectedDataConfig != null) {
      for (const config of selectedDataConfig) {
        selectedDataMap.set(config.seriesId, selectedDataMap.get(config.seriesId) ?? []);
        selectedDataMap.get(config.seriesId).push(config.domainValue);
      }

      // Add to list of selected series.
      rst._selectedSeries.push(...seriesList.filter(
        (series) => [...selectedDataMap.keys()].includes(series.id),
      ))

      // Add to list of selected data.
      for (const series of seriesList) {
        if ([...selectedDataMap.keys()].includes(series.id)) {
          const { domainFn } = series;

          for (let i = 0; i < series.data.length; i++) {
            const datum = series.data[i];
            if (selectedDataMap.get(series.id).includes(domainFn(i))) {
              rst._selectedDatum.push(new SeriesDatum(series, datum));
            }
          }
        }
      }
    }
    // Add to list of selected series, if it does not already exist.
    if (selectedSeriesConfig != null) {
      const remainingSeriesToAdd = selectedSeriesConfig.filter(
        (seriesId) => rst.selectedSeries.findIndex(
          (series) => series.id === seriesId,
        ) === -1,
      );

      rst._selectedSeries.push(...seriesList.filter(
        (series) => remainingSeriesToAdd.includes(series.id),
      ))
    }

    return rst;
  }

  get selectedSeries() {
    return [...this._selectedSeries];
  }
}
