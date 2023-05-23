
export function isIterable(v) {
  let result = v != null;
  if (result) {
    result = Array.isArray(v);
    if (!result) {
      try {
        result = typeof obj[Symbol.iterator] === 'function';
      } catch (e) {}

    }
  }
  return result;
}

export default isIterable
