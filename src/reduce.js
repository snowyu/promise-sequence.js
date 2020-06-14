require('./array-from')

var isIterable = require('./is-iterable');

// reducer: function(any accumulator, any item, int index, int length): any
function reduce(iterator, reducer, initialValue) {
  return Promise.resolve(iterator).then(genReducer(reducer, initialValue));
}

function genReducer(reducer, initialValue) {
  if (typeof reducer !== 'function') { throw new TypeError('reducer should be a func')}
  return function(val) {
  if (!isIterable(val)) return Promise.reject(new TypeError('iterator should be iteratabled'))
  val = Array.isArray(val) ? val : Array.from(val)

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

module.exports = reduce
module.exports.default = reduce

if (!Promise.reduce) Promise.reduce = reduce;

// module.exports.patch = function patch() {
//   if (!Promise.reduce) Promise.reduce = reduce;
// }
