import { get } from 'package:dart/get';
import { LineStyleSpec } from '../../chart/cartesian/axis/spec/axis-spec';
import { Color } from '../color';
import { GraphicsFactory } from '../graphics-factory';
import { LineStyle } from '../line-style';
import { MaterialPalette } from '../material-palette';
import { Palette } from '../palette';
import { Style } from './style';

export class MaterialStyle implements Style {
  get black() {
    return MaterialPalette.black;
  }

  get transparent() {
    return MaterialPalette.transparent;
  }

  get white() {
    return MaterialPalette.white;
  }

  getOrderedPalettes = (count: number) =>
    MaterialPalette.getOrderedPalettes(count);

  createAxisLineStyle = (
    graphicFactory: GraphicsFactory,
    spec: LineStyleSpec,
  ) => {
    const rst = graphicFactory.createLinePaint();
    rst.color = get(spec, 'color') || MaterialPalette.gray.shadeDefault;
    rst.dashPattern = get(spec, 'dashPattern')
  }
}
