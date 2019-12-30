import { LineStyleSpec } from '../../chart/cartesian/axis/spec/axis-spec';
import { GraphicsFactory } from '../graphics-factory';
import { MaterialPalette } from '../material-palette';
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
    rst.color = spec?.color || MaterialPalette.gray.shadeDefault;
    rst.dashPattern = spec?.dashPattern;
    rst.strokeWidth = spec?.thickness || 1;
    return rst;
  };

  createTickLineStyle = (
    graphicFactory: GraphicsFactory,
    spec: LineStyleSpec,
  ) => {
    const rst = graphicFactory.createLinePaint();
    rst.color = spec?.color || MaterialPalette.gray.shadeDefault;
    rst.dashPattern = spec?.dashPattern;
    rst.strokeWidth = spec?.thickness || 1;
    return rst;
  };

  get tickLength() {
    return 3;
  }

  get tickColor() {
    return MaterialPalette.gray.shade800;
  }

  createGridlineStyle = (
    graphicFactory: GraphicsFactory,
    spec: LineStyleSpec,
  ) => {
    const rst = graphicFactory.createLinePaint();
    rst.color = spec?.color || MaterialPalette.gray.shade300;
    rst.dashPattern = spec?.dashPattern;
    rst.strokeWidth = spec?.thickness || 1;
    return rst;
  };

    
  get arcLabelOutsideLeaderLine() {
    return MaterialPalette.gray.shade600;
  }
  get defaultSeriesColor() {
    return MaterialPalette.gray.shadeDefault;
  }
  get arcStrokeColor() {
    return MaterialPalette.white;
  }
  get legendEntryTextColor() {
    return MaterialPalette.gray.shade800;
  }
  get legendTitleTextColor() {
    return MaterialPalette.gray.shade800;
  }
  get linePointHighlighterColor() {
    return MaterialPalette.gray.shade600;
  }
  get noDataColor() {
    return MaterialPalette.gray.shade200;
  }
  get rangeAnnotationColor() {
    return MaterialPalette.gray.shade100;
  }
  get sliderFillColor() {
    return MaterialPalette.white;
  }
  get sliderStrokeColor() {
    return MaterialPalette.gray.shade600;
  }
  get chartBackgroundColor() {
    return MaterialPalette.white;
  }
  get rangeBandSize() {
    return 0.65;
  }
}
