import reduce from './reduce'

const promiseReduce = Promise.reduce || reduce;

/**
 *
 * @param aList {Array} each item as argument pass to the task.
 * @param task {Promise} promise of task function
 * @returns
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
