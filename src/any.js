import reduce from './reduce'

const promiseReduce = Promise.reduce || reduce;

/**
 * Executes a provided task function with a list of arguments sequentially until the result is not `null`.
 *
 * @param {Array} aList The list of arguments to pass into the task function.
 * @param {Promise} task The function to execute with the arguments.
 * @returns {Promise} A promise that resolves to the result of the task function, or null if no result is found.
 *
 * @example
 * // Find the first even number in an array using the any() function.
 * const numbers = [1, 3, 5, 6, 7];
 * const evenNumber = await any(numbers, (num) => {
 *   if (num % 2 === 0) {
 *     return num;
 *   }
 * });
 * console.log(evenNumber); // Output: 6
 *
 * // Find the first string with length greater than 5 characters using the any() function.
 * const strings = ["hello", "world", "foo", "bar"];
 * const longString = await any(strings, (str) => {
 *   if (str.length >5) {
 *     return str;
 *   }
 * });
 * console.log(longString); // Output: "world"
 */
export function any(aList, task){
  function _genReduceFn(fn) {
    return function (previous, item){
      if (previous == null) {
        previous = fn ? Promise.resolve(item).then(function(item){return fn(item)}) : item;
      }
      return previous;
    };
  }

  return promiseReduce(aList, _genReduceFn(task), null);
};

export default any
