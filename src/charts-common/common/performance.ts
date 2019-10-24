/* eslint-disable no-unused-vars */

export interface PerformanceCallback {
  (tag: string): void;
}

export class Performance {
  static time: PerformanceCallback = (_) => {};
  static timeEnd: PerformanceCallback = (_) => {};
}
