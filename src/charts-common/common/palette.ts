import { Color } from './color';

// A color palette.
export abstract class Palette {
  // The default shade.
  abstract get shadeDefault(): Color;

  // Returns a list of colors for this color palette.
  makeShades = (colorCnt: number) => {
    const colors: Array<Color> = [this.shadeDefault];

    // If we need more than 2 colors, then [unselected] collides with one of the
    // generated colors. Otherwise divide the space between the top color
    // and white in half.
    const lighterColor = colorCnt < 3
      ? this.shadeDefault.lighter
      : this._getSteppedColor(this.shadeDefault, (colorCnt * 2) - 1, colorCnt * 2);
    
    // Divide the space between 255 and c500 evenly according to the colorCnt.
    for (let i = 0; i < colorCnt; i++) {
      colors.push(this._getSteppedColor(this.shadeDefault, i, colorCnt,
        {darker: this.shadeDefault.darker, lighter: this.shadeDefault.lighter},));
    }

    colors.push(Color.fromOther({color: this.shadeDefault, lighter: lighterColor}));
    return colors;
  };

  _getSteppedColor = (
    color: Color,
    index: number,
    steps: number,
    {
      darker,
      lighter,
    }: {
      darker?: Color,
      lighter?: Color,
    } = {},
  ) => {
    const fracion = index / steps;
    return new Color({
      r: color.r + Math.round((255 - color.r) * fracion),
      g: color.r + Math.round((255 - color.g) * fracion),
      b: color.r + Math.round((255 - color.b) * fracion),
      a: color.r + Math.round((255 - color.a) * fracion),
      darker,
      lighter,
    })
  };
}