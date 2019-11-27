/* eslint-disable no-unused-vars */

import { Rectangle, Point } from 'package:dart/math';

import { Color } from '../../common/color';
import { GraphicsFactory } from '../../common/graphics-factory';
import { StyleFactory } from '../../common/style/style-factory';
import { SymbolRenderer } from '../../common/symbol-renderer';
import { AttributeKey } from '../../data/series';
import {
  LayoutPosition,
  LayoutView,
  LayoutViewConfig,
  LayoutViewPositionOrder,
  ViewMeasuredSizes,
} from '../layout/layout-view';
import { BaseChart } from './base-chart';
import { ChartCanvas } from './chart-canvas';
import { DatumDetails } from './datum-details';
import { ImmutableSeries, MutableSeries } from './processed-series';
import { SeriesDatum } from './series-datum';

/// Unique identifier used to associate custom series renderers on a chart with
/// one or more series of data.
///
/// [rendererIdKey] can be added as an attribute to user-defined [Series]
/// objects.
export const rendererIdKey = new AttributeKey<string>('SeriesRenderer.rendererId');

export const rendererKey = new AttributeKey<string>('SeriesRenderer.renderer');

/// A series renderer draws one or more series of data onto a chart canvas.
export abstract class SeriesRenderer<D> extends LayoutView {
  static defaultRendererId = 'default';

  /// Symbol renderer for this renderer.
  ///
  /// The default is set natively by the platform. This is because in Flutter,
  /// the [SymbolRenderer] has to be a Flutter wrapped version to support
  /// building widget based symbols.
  abstract get symbolRenderer(): SymbolRenderer;

  abstract set symbolRenderer(symbolRenderer: SymbolRenderer);

  /// Unique identifier for this renderer. Any [Series] on a chart with a
  /// matching  [rendererIdKey] will be drawn by this renderer.
  abstract get rendererId(): string;

  abstract set rendererId(rendererId: string);

  /// Handles any setup of the renderer that needs to be deferred until it is
  /// attached to a chart.
  abstract onAttach(chart: BaseChart<D>): void;

  /// Handles any clean-up of the renderer that needs to be performed when it is
  /// detached from a chart.
  abstract onDetach(chart: BaseChart<D>): void;

  /// Performs basic configuration for the series, before it is pre-processed.
  ///
  /// Typically, a series renderer should assign color mapping functions to
  /// series that do not have them.
  abstract configureSeries(seriesList: Array<MutableSeries<D>>): void;

  /// Pre-calculates some details for the series that will be needed later
  /// during the drawing phase.
  abstract preprocessSeries(seriesList: Array<MutableSeries<D>>): void;

  /// Adds the domain values for the given series to the chart's domain axis.
  abstract configureDomainAxes(seriesList: Array<MutableSeries<D>>): void;

  /// Adds the measure values for the given series to the chart's measure axes.
  abstract configureMeasureAxes(seriesList: Array<MutableSeries<D>>): void;

  /// Generates rendering data needed to paint the data on the chart.
  ///
  /// This is called during the post layout phase of the chart draw cycle.
  abstract update(seriesList: Array<ImmutableSeries<D>>, isAnimating: boolean): void;

  /// Renders the series data on the canvas, using the data generated during the
  /// [update] call.
  abstract paint(canvas: ChartCanvas, animationPercent: number): void;

  /// Gets a list the data from each series that is closest to a given point.
  ///
  /// [chartPoint] represents a point in the chart, such as a point that was
  /// clicked/tapped on by a user.
  ///
  /// [byDomain] specifies whether the nearest data should be defined by domain
  /// distance, or relative Cartesian distance.
  ///
  /// [boundsOverride] optionally specifies a bounding box for the selection
  /// event. If specified, then no data should be returned if [chartPoint] lies
  /// outside the box. If not specified, then each series renderer on the chart
  /// will use its own component bounds for filtering out selection events
  /// (usually the chart draw area).
  abstract getNearestDatumDetailPerSeries(
    chartPoint: Point, byDomain: boolean, boundsOverride: Rectangle): Array<DatumDetails<D>>;

  /// Get an expanded set of processed [DatumDetails] for a given [SeriesDatum].
  ///
  /// This is typically called by chart behaviors that need to get full details
  /// on selected data.
  abstract getDetailsForSeriesDatum(seriesDatum: SeriesDatum<D>): DatumDetails<D>;

  /// Adds chart position data to [details].
  ///
  /// This is a helper function intended to be called from
  /// [getDetailsForSeriesDatum]. Every concrete [SeriesRenderer] needs to
  /// implement custom logic for setting location data.
  abstract addPositionToDetailsForSeriesDatum(
    details: DatumDetails<D>, seriesDatum: SeriesDatum<D>): DatumDetails<D>;
}

/// Concrete base class for [SeriesRenderer]s that implements common
/// functionality.
abstract class BaseSeriesRenderer<D> implements SeriesRenderer<D> {
  readonly layoutConfig: LayoutViewConfig;

  rendererId: string;

  symbolRenderer: SymbolRenderer;

  _drawAreaBounds: Rectangle;

  get drawBounds() {
    return this._drawAreaBounds;
  }

  _graphicsFactory: GraphicsFactory;

  constructor({
    rendererId,
    layoutPaintOrder,
    symbolRenderer,
  }: {
    rendererId: string,
    layoutPaintOrder: number,
    symbolRenderer?: SymbolRenderer,
  }) {
    this.rendererId = rendererId;
    this.symbolRenderer = symbolRenderer;
    this.layoutConfig = new LayoutViewConfig({
      paintOrder: layoutPaintOrder,
      position: LayoutPosition.DrawArea,
      positionOrder: LayoutViewPositionOrder.drawArea,
    });
  }

  get graphicsFactory() {
    return this._graphicsFactory;
  }

  set graphicsFactory(value: GraphicsFactory) {
    this._graphicsFactory = value;
  }

  onAttach = (chart: BaseChart<D>) => {}

  onDetach = (chart: BaseChart<D>) => {}

  /// Assigns colors to series that are missing their colorFn.
  ///
  /// [emptyCategoryUsesSinglePalette] Flag indicating whether having all
  ///     series with no categories will use the same or separate palettes.
  ///     Setting it to true uses various Blues for each series.
  ///     Setting it to false used different palettes (ie: s1 uses Blue500,
  ///     s2 uses Red500),
  protected assignMissingColors = (seriesList: Array<MutableSeries<D>>, {
    emptyCategoryUsesSinglePalette,
  }: {
    emptyCategoryUsesSinglePalette: boolean,
  }) => {
    const defaultCategory = '__default__';

    // Count up the number of missing series per category, keeping a max across
    // categories.
    const missingColorCountPerCategory: Map<string, number> = {};
    let maxMissing = 0;
    let hasSpecifiedCategory = false;

    seriesList.forEach((series) => {
      // Assign the seriesColor as the color of every datum if no colorFn was
      // provided.
      if (series.colorFn == null && series.seriesColor != null) {
        series.colorFn = (_) => series.seriesColor;
      }

      // This series was missing both seriesColor and a colorFn. Add it to the
      // "missing" set.
      if (series.colorFn == null) {
        // If there is no category, give it a default category to match logic.
        let category = series.seriesCategory;
        if (category == null) {
          category = defaultCategory;
        } else {
          hasSpecifiedCategory = true;
        }

        // Increment the missing counts for the category.
        const missingCnt = (missingColorCountPerCategory.get(category) || 0) + 1;
        missingColorCountPerCategory.set(category, missingCnt);
        maxMissing = Math.max(maxMissing, missingCnt);
      }
    });
  }
}
