import { Rectangle } from 'package:dart/math';
import {} from './layout-view';

export class SizeList {
  readonly _size: Array<number> = [];
  _total = 0;

  get = (i: number) => this._size[i];

  get total() {
    return this._total;
  }

  get length() {
    return this._size.length;
  }

  add = (size: number) => {
    this._size.push(size);
    this._total += size;
  }

  adjust = (index: number, amount: number) => {
    this._size[index] += amount;
    this._total += amount;
  }
}

class _DesiredViewSizes {
  
}
