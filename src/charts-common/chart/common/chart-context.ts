import { Duration } from 'package:dart/core';

import { DateTimeFactory } from '../../common/date-time-factory';
import { RTLSpec } from '../../common/rtl-spec';

export abstract class ChartContext {
  // Flag indicating whether or not the chart's container was configured in
  // right to left mode.
  //
  // This should be set when the chart is created (or if its container ever
  // gets configured to the other direction setting).
  //
  // Any chart component that needs to know whether the chart axes should be
  // rendered right to left should read [isRtl].
  abstract get chartContainerIsRtl(): boolean;

  // Configures the behavior of the chart when [chartContainerIsRtl] is true.
  abstract get rtlSpec(): RTLSpec;

  // Gets whether or not the chart axes should be rendered in right to left
  // mode.
  //
  // This will only be true if the container for the chart component was
  // configured with the rtl direction setting ([chartContainerIsRtl] == true), and the chart's
  // [RTLSpec] is set to reverse the axis direction in rtl mode.
  abstract get isRtl(): boolean;

  // Whether or not the chart will respond to tap events.
  //
  // This will generally be true if there is a behavior attached to the chart
  // that does something with tap events, such as "click to select data."
  abstract get isTappable(): boolean;

  abstract get pixelsPerDp(): number;

  abstract get dateTimeFactory(): DateTimeFactory;

  abstract requestRedraw(): void;

  abstract requestAnimation(transition: Duration): void;

  abstract requestPaint(): void;
}
