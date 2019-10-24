// Defines the behavior of the chart if it is RTL.
export class RTLSpec {
  constructor({ axisDirection = AxisDirection.reversed }: { axisDirection?: AxisDirection } = {}) {
    this.axisDirection = axisDirection;
  }

  readonly axisDirection: AxisDirection;
}

// Direction of the domain axis when the chart container is configured for
// RTL mode.
//
// [normal] Vertically rendered charts will have the primary measure axis on
// the left and secondary measure axis on the right. Domain axis is on the left
// and the domain output range starts from the left and grows to the right.
// Horizontally rendered charts will have the primary measure axis on the
// bottom and secondary measure axis on the right. Measure output range starts
// from the left and grows to the right.
//
// [reversed] Vertically rendered charts will have the primary measure axis on
// the right and secondary measure axis on the left. Domain axis is on the
// right and domain values grows from the right to the left. Horizontally
// rendered charts will have the primary measure axis on the top and secondary
// measure axis on the left. Measure output range is flipped and grows from the
// right to the left.
export enum AxisDirection {
  normal,
  reversed,
}
