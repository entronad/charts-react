export class DateFormat {
  constructor(pattern?: string) {
    this._pattern = pattern;
  }

  _pattern: string;

  get pattern() {
    return this._pattern;
  }

  addPattern = (pattern: string) => {
    this._pattern = pattern;
  }

  format = (date: Date) => {
    
  }
}
