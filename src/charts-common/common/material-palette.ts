import { Color } from './color';
import { Palette } from './palette';

// A canonical palette of colors from material.io.
//
// @link https://material.io/guidelines/style/color.html#color-color-palette
export class MaterialPalette {
  static readonly black = new Color({ r: 0, g: 0, b: 0 });
  static readonly transparent = new Color({ r: 0, g: 0, b: 0, a: 0 });
  static readonly white = new Color({ r: 255, g: 255, b: 255 });

  static get blue() {
    return new MaterialBlue();
  }
  static get red() {
    return new MaterialRed();
  }
  static get yellow() {
    return new MaterialYellow();
  }
  static get green() {
    return new MaterialGreen();
  }
  static get purple() {
    return new MaterialPurple();
  }
  static get cyan() {
    return new MaterialCyan();
  }
  static get deepOrange() {
    return new MaterialDeepOrange();
  }
  static get lime() {
    return new MaterialLime();
  }
  static get indigo() {
    return new MaterialIndigo();
  }
  static get pink() {
    return new MaterialPink();
  }
  static get teal() {
    return new MaterialTeal();
  }
  static get gray() {
    return new MaterialGray();
  }

  // Lazily-instantiated iterable, to avoid allocating colors that are not used.
  static readonly _orderedPalettes: Array<() => Palette> = [
    () => MaterialPalette.blue,
    () => MaterialPalette.red,
    () => MaterialPalette.yellow,
    () => MaterialPalette.green,
    () => MaterialPalette.purple,
    () => MaterialPalette.cyan,
    () => MaterialPalette.deepOrange,
    () => MaterialPalette.lime,
    () => MaterialPalette.indigo,
    () => MaterialPalette.pink,
    () => MaterialPalette.teal,
  ];

  static getOrderedPalettes = (count: number) =>
    MaterialPalette._orderedPalettes.slice(0, count).map(f => f());
}

export class MaterialBlue extends Palette {
  static readonly _shade200 = new Color({ r: 0x90, g: 0xCA, b: 0xF9 });
  static readonly _shade700 = new Color({ r: 0x19, g: 0x76, b: 0xD2 });
  static readonly _shade500 = new Color({ r: 0x21, g: 0x96, b: 0xF3,
    darker: MaterialBlue._shade700, lighter: MaterialBlue._shade200 });

  get shadeDefault() {
    return MaterialBlue._shade500;
  }
}

export class MaterialRed extends Palette {
  static readonly _shade200 = new Color({ r: 0xEF, g: 0x9A, b: 0x9A });
  static readonly _shade700 = new Color({ r: 0xD3, g: 0x2F, b: 0x2F });
  static readonly _shade500 = new Color({ r: 0xF4, g: 0x43, b: 0x36,
    darker: MaterialRed._shade700, lighter: MaterialRed._shade200 });

  get shadeDefault() {
    return MaterialRed._shade500;
  }
}

export class MaterialYellow extends Palette {
  static readonly _shade200 = new Color({ r: 0xFF, g: 0xF5, b: 0x9D });
  static readonly _shade700 = new Color({ r: 0xFB, g: 0xC0, b: 0x2D });
  static readonly _shade500 = new Color({ r: 0xFF, g: 0xEB, b: 0x3B,
    darker: MaterialYellow._shade700, lighter: MaterialYellow._shade200 });

  get shadeDefault() {
    return MaterialYellow._shade500;
  }
}

export class MaterialGreen extends Palette {
  static readonly _shade200 = new Color({ r: 0xA5, g: 0xD6, b: 0xA7 });
  static readonly _shade700 = new Color({ r: 0x38, g: 0x8E, b: 0x3C });
  static readonly _shade500 = new Color({ r: 0x4C, g: 0xAF, b: 0x50,
    darker: MaterialGreen._shade700, lighter: MaterialGreen._shade200 });

  get shadeDefault() {
    return MaterialGreen._shade500;
  }
}

export class MaterialPurple extends Palette {
  static readonly _shade200 = new Color({ r: 0xCE, g: 0x93, b: 0xD8 });
  static readonly _shade700 = new Color({ r: 0x00, g: 0x97, b: 0xA7 });
  static readonly _shade500 = new Color({ r: 0x00, g: 0xBC, b: 0xD4,
    darker: MaterialPurple._shade700, lighter: MaterialPurple._shade200 });

  get shadeDefault() {
    return MaterialPurple._shade500;
  }
}

export class MaterialCyan extends Palette {
  static readonly _shade200 = new Color({ r: 0x80, g: 0xAB, b: 0x91 });
  static readonly _shade700 = new Color({ r: 0xE6, g: 0x4A, b: 0x19 });
  static readonly _shade500 = new Color({ r: 0xFF, g: 0x57, b: 0x22,
    darker: MaterialCyan._shade700, lighter: MaterialCyan._shade200 });

  get shadeDefault() {
    return MaterialCyan._shade500;
  }
}

export class MaterialDeepOrange extends Palette {
  static readonly _shade200 = new Color({ r: 0xFF, g: 0xAB, b: 0x91 });
  static readonly _shade700 = new Color({ r: 0xE6, g: 0x4A, b: 0x19 });
  static readonly _shade500 = new Color({ r: 0xFF, g: 0x57, b: 0x22,
    darker: MaterialDeepOrange._shade700, lighter: MaterialDeepOrange._shade200 });

  get shadeDefault() {
    return MaterialDeepOrange._shade500;
  }
}

export class MaterialLime extends Palette {
  static readonly _shade200 = new Color({ r: 0xE6, g: 0xEE, b: 0x9C });
  static readonly _shade700 = new Color({ r: 0xAF, g: 0xB4, b: 0x2B });
  static readonly _shade500 = new Color({ r: 0xCD, g: 0xDC, b: 0x39,
    darker: MaterialLime._shade700, lighter: MaterialLime._shade200 });

  get shadeDefault() {
    return MaterialLime._shade500;
  }
}

export class MaterialIndigo extends Palette {
  static readonly _shade200 = new Color({ r: 0x9F, g: 0xA8, b: 0xDA });
  static readonly _shade700 = new Color({ r: 0x30, g: 0x3F, b: 0x9F });
  static readonly _shade500 = new Color({ r: 0x3F, g: 0x51, b: 0xB5,
    darker: MaterialIndigo._shade700, lighter: MaterialIndigo._shade200 });

  get shadeDefault() {
    return MaterialIndigo._shade500;
  }
}

export class MaterialPink extends Palette {
  static readonly _shade200 = new Color({ r: 0xF4, g: 0x8F, b: 0xB1 });
  static readonly _shade700 = new Color({ r: 0xC2, g: 0x18, b: 0x5B });
  static readonly _shade500 = new Color({ r: 0xE9, g: 0x1E, b: 0x63,
    darker: MaterialPink._shade700, lighter: MaterialPink._shade200 });

  get shadeDefault() {
    return MaterialPink._shade500;
  }
}

export class MaterialTeal extends Palette {
  static readonly _shade200 = new Color({ r: 0x80, g: 0xCB, b: 0xC4 });
  static readonly _shade700 = new Color({ r: 0x00, g: 0x79, b: 0x6B });
  static readonly _shade500 = new Color({ r: 0x00, g: 0x96, b: 0x88,
    darker: MaterialTeal._shade700, lighter: MaterialTeal._shade200 });

  get shadeDefault() {
    return MaterialTeal._shade500;
  }
}

export class MaterialGray extends Palette {
  static readonly _shade200 = new Color({ r: 0xEE, g: 0xEE, b: 0xEE });
  static readonly _shade700 = new Color({ r: 0x61, g: 0x61, b: 0x61 });
  static readonly _shade500 = new Color({ r: 0x9E, g: 0x9E, b: 0x9E,
    darker: MaterialGray._shade700, lighter: MaterialGray._shade200 });

  get shadeDefault() {
    return MaterialGray._shade500;
  }

  get shade50() {
    return new Color({ r: 0xFA, g: 0xFA, b: 0xFA });
  }
  get shade100() {
    return new Color({ r: 0xF5, g: 0xF5, b: 0xF5 });
  }
  get shade200() {
    return MaterialGray._shade200;
  }
  get shade300() {
    return new Color({ r: 0xE0, g: 0xE0, b: 0xE0 });
  }
  get shade400() {
    return new Color({ r: 0xBD, g: 0xBD, b: 0xBD });
  }
  get shade500() {
    return MaterialGray._shade500;
  }
  get shade600() {
    return new Color({ r: 0x75, g: 0x75, b: 0x75 });
  }
  get shade700() {
    return MaterialGray._shade700;
  }
  get shade800() {
    return new Color({ r: 0x42, g: 0x42, b: 0x42 });
  }
  get shade900() {
    return new Color({ r: 0x21, g: 0x21, b: 0x21 });
  }
}
