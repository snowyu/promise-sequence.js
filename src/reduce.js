import isIterable from './is-iterable';

const arrayFrom = Array.from

// reducer: function(any accumulator, any item, int index, int length): any
/**
 * Reduces an iterable to a single value using the provided reducer function and an optional initial value, returning a Promise that resolves to the resulting value.
 * @param {Iterable} iterator The iterable to reduce.
 * @param {function} reducer The reducer function to apply to each element in the iterable. Takes four arguments (accumulator, currentValue, currentIndex, array) and returns the new value of the accumulator.
 * @param {*} [initialValue] An optional initial value for the accumulator. If not provided, the first element in the iterable will be used as the initial value.
 * @returns {Promise} - A Promise that resolves to the resulting value of the reduction.
 * @throws {TypeError} - If the reducer is not a function or the iterator is not iterable.
 *
 * @example
 * const myArray = [1, 2, 3, 4, 5];
 * const myReducer = (accumulator, currentValue) => accumulator + currentValue;
 * reduce(myArray, myReducer).then((result) => {
 * // result will be 15
 * });
 * const mySet = new Set([1, 2, 3, 4, 5]);
 * reduce(mySet, myReducer, 10).then((result) => {
 * // result will be 25
 * });
 *
 */
export function reduce(iterator, reducer, initialValue) {
  return Promise.resolve(iterator).then(genReducer(reducer, initialValue));
}

function genReducer(reducer, initialValue) {
  if (typeof reducer !== 'function') { throw new TypeError('reducer should be a func')}
  return function(val) {
  if (!isIterable(val)) {return Promise.reject(new TypeError('iterator should be iteratabled'))}
  val = Array.isArray(val) ? val : arrayFrom(val)

    const length = val.length;

    if (length === 0) {
      return Promise.resolve(initialValue);
    }

    return val.reduce(function (accumulator, currentValue, index, arr) {
      if (accumulator && typeof accumulator.then === 'function') {
        return accumulator.then(function (result) {
          if (result === undefined && length === 1) {
            return currentValue;
          }
          return reducer(result, currentValue, index, arr)
        })
      } else {
        if (accumulator === undefined && length === 1) {
          return currentValue;
        }
        return reducer(accumulator, currentValue, index, arr)
      }
    }, Promise.resolve(initialValue))
  }
}

export default reduce

// module.exports.patch = function patch() {
//   if (!Promise.reduce) Promise.reduce = reduce;
// }
