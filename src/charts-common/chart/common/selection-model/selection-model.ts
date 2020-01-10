import { ArrayUtil } from 'package:dart/core';

import { ImmutableSeries } from '../processed-series';
import { SeriesDatum, SeriesDatumConfig } from '../series-datum';

// Holds the state of interaction or selection for the chart to coordinate
// between various event sources and things that wish to act upon the selection
// state (highlight, drill, etc).
//
// There is one instance per interaction type (ex: info, action) with each
// maintaining their own state. Info is typically used to update a hover/touch
// card while action is used in case of a secondary selection/action.
//
// The series selection state is kept separate from datum selection state to
// allow more complex highlighting. For example: a Hovercard that shows entries
// for each datum for a given domain/time, but highlights the closest entry to
// match up with highlighting/bolding of the line and legend.
export class SelectionModel<D> {
  _selectedDatum: Array<SeriesDatum<D>> = [];
  _selectedSeries: Array<ImmutableSeries<D>> = [];

  // Create selection model with the desired selection.
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

  // Create a deep copy of the selection model.
  static fromOther = <D>(other: SelectionModel<D>) =>
    new SelectionModel<D>({
      selectedData: [...other._selectedDatum],
      selectedSeries: [...other._selectedSeries],
    });

  // Create selection model from configuration.
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

  // Returns true if this [SelectionModel] has a selected datum.
  get hasDatumSelection() {
    return this._selectedDatum.length > 0
  }

  isDatumSelected = (series: ImmutableSeries<D>, index: number) => {
    const datum = index == null ? null : series.data[index];
    return this._selectedDatum.findIndex((item) => item.equals(new SeriesDatum(series, datum)));
  };

  // Returns the selected [SeriesDatum] for this [SelectionModel].
  //
  // This is empty by default.
  get selectedDatum() {
    return [...this._selectedDatum];
  }

  // Returns true if this [SelectionModel] has a selected series.
  get hasSeriesSelection() {
    return this._selectedSeries.length > 0
  }

  // Returns the selected [ImmutableSeries] for this [SelectionModel].
  //
  // This is empty by default.
  get selectedSeries() {
    return [...this._selectedSeries];
  }

  // Returns true if this [SelectionModel] has a selected datum or series.
  get hasAnySelection() {
    return this._selectedDatum.length > 0 || this._selectedSeries.length > 0;
  }

  equals = (other: any) =>
    (other instanceof SelectionModel &&
    ArrayUtil.equals(other._selectedSeries, this._selectedSeries) &&
    ArrayUtil.equals(other._selectedDatum, this._selectedDatum, (d1, d2) => d1.equals(d2)));
}

// A [SelectionModel] that can be updated.
//
// This model will notify listeners subscribed to this model when the selection
// is modified.
export class MutableSelectionModel<D> extends SelectionModel<D> {
  readonly _changedListeners: Array<SelectionModelListener<D>> = [];
  readonly _updatedListeners: Array<SelectionModelListener<D>> = [];

  // When set to true, prevents the model from being updated.
  locked = false;

  // Clears the selection state.
  clearSelection = ({notifyListeners = true} = {}) =>
    this.updateSelection([], [], {notifyListeners});

  // Updates the selection state. If mouse driven, [datumSelection] should be
  // ordered by distance from mouse, closest first.
  updateSelection = (
    datumSelection: Array<SeriesDatum<D>>,
    seriesList: Array<ImmutableSeries<D>>,
    {notifyListeners = true} = {}
  ) => {
    if (this.locked) {
      return false;
    }

    const origSelectedDatum = this._selectedDatum;
    const origSelectedSeries = this._selectedSeries;

    this._selectedDatum = datumSelection;
    this._selectedSeries = seriesList;

    // Provide a copy, so listeners get an immutable model.
    const copyOfSelectionModel = SelectionModel.fromOther(this);
    this._updatedListeners.forEach((listener) => listener(copyOfSelectionModel));

    const changed =
        !ArrayUtil.equals(origSelectedDatum, this._selectedDatum) ||
            !ArrayUtil.equals(origSelectedSeries, this._selectedSeries);
    if (notifyListeners && changed) {
      this._changedListeners.forEach((listener) => listener(copyOfSelectionModel));
    }
    return changed;
  };

  // Add a listener to be notified when this [SelectionModel] changes.
  //
  // Note: the listener will not be triggered if [updateSelection] is called
  // resulting in the same selection state.
  addSelectionChangedListener = (listener: SelectionModelListener<D>) => {
    this._changedListeners.push(listener);
  }

  // Remove listener from being notified when this [SelectionModel] changes.
  removeSelectionChangedListener = (listener: SelectionModelListener<D>) => {
    ArrayUtil.remove(this._changedListeners, listener);
  }

  // Add a listener to be notified when [updateSelection] is called, even if
  // the selection state is the same.
  //
  // This is necessary in order to support programmatic selections in Flutter.
  // Due to the way widgets are constructed in Flutter, there currently isn't
  // a way for users to programmatically specify the selection. In order to
  // provide this support, the users who subscribe to the selection updated
  // event can keep a copy of the selection model and also decide if it should
  // be overwritten.
  addSelectionUpdatedListener = (listener: SelectionModelListener<D>) => {
    this._updatedListeners.push(listener);
  }

  // Remove listener from being notified when [updateSelection] is called.
  removeSelectionUpdatedListener = (listener: SelectionModelListener<D>) => {
    ArrayUtil.remove(this._updatedListeners, listener);
  }

  // Remove all listeners.
  clearAllListeners = () => {
    this._changedListeners.length = 0;
    this._updatedListeners.length = 0;
  }
}

// Callback for SelectionModel. It is triggered when the selection state
// changes.
type SelectionModelListener<D> = (model: SelectionModel<D>) => void;

export enum SelectionModelType {
  // Typical Hover or Details event for viewing the details of the selected
  // items.
  info,

  // Typical Selection, Drill or Input event likely updating some external
  // content.
  action,
}
