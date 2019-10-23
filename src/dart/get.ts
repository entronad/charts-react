import lodashGet from 'lodash/get';

// Extends _.get() for safe apply of call operator:
//     a?.b         ===>    get(a, 'b')
//     a?.b()       ===>    get(a, 'b', [])
//     a?.b(1, 2)   ===>    get(a, 'b', [1, 2])
export const get = <TObject extends object, TKey extends keyof TObject>(
  object: TObject,
  path: TKey | [TKey],
  args?: Array<any>,
) => {
  const member: any = lodashGet(object, path);
  if (args == null || member == null) {
    return member;
  }
  return member(...args);
};
