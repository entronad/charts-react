import { Rectangle, Point } from 'package:dart/math';

import { GestureListener } from '../../common/gesture-listener';
import { GraphicsFactory } from '../../common/graphics-factory';
import { ProxyGestureListener } from '../../common/proxy-gesture-listener';
import { Series } from '../../data/series';
import { LayoutConfig } from '../layout/layout-config';
import { LayoutManager } from '../layout/layout-manager';
import { LayoutManagerImpl } from '../layout/layout-manager-impl';
import { LayoutView } from '../layout/layout-view';
// import {} from './be'
import { ChartCanvas } from './chart-canvas';
import { ChartContext } from './chart-context';
import { DatumDetails } from './datum-details';
import { MutableSeries } from './processed-series';
// import {} from 'se'
import { SeriesDatum } from './series-datum';
import { SeriesRenderer, rendererIdKey, rendererKey } from './series-renderer';

export class BaseChart<D> {

}