const remove = <T>(arr: Array<T>, ele: T) => {
  const index = arr.indexOf(ele);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

const equals = <T>(
  arr1: Array<T>,
  arr2: Array<T>,
  compare?: (ele1: T, ele2: T) => boolean,
) => {
  // For null and undefined.
  if (arr1 == arr2) {
    return true;
  }

  if (arr1?.length !== arr2?.length) {
    return false;
  }
  
  for (let i = 0; i < arr1?.length; i++) {
    if (compare != null) {
      if (compare(arr1?.[i], arr2?.[i]) === false) {
        return false;
      }
    } else {
      if (arr1?.[i] !== arr2?.[i]) {
        return false;
      }
    }
  }

  return true;
}

export const ArrayUtil = {
  remove,
  equals,
}
