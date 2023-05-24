
/**
 * Check the value whether iterable.
 *
 * @internal
 * @param {*} v
 * @returns
 */
export function isIterable(v) {
  let result = v != null;
  if (result) {
    result = Array.isArray(v);
    if (!result) {
      try {
        result = typeof v[Symbol.iterator] === 'function';
      } catch (e) {}

    }
  }
  return result;
}

export default isIterable
