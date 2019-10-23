import { MaterialStyle } from './material-style';
import { Style } from './style';

export class StyleFactory {
  static readonly _styleFactory = new StyleFactory();

  _style = new MaterialStyle();

  // The [Style] that is used for all the charts in this application.
  static get style() {
    return this._styleFactory._style;
  }

  static set style(value: Style) {
    this._styleFactory._style = value;
  }
}
