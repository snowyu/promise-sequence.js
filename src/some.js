import reduce from './reduce'

const promiseReduce = Promise.reduce || reduce

function _undefined(i){
  return (i !== undefined)
}

/**
 * @param {Array} aList each item as argument pass to the task.
 * @param {Number|Promise} [total] optional total number or task function
 * @param {Promise} [task] optional task function
 */
export function some(aList, total, task){
  function _genReduceFn(fn) {
    return function (previous, item){
      previous = previous.filter(_undefined)
      if (!total || previous.length < total) {
        previous = Promise.all(previous.concat(fn ? Promise.resolve(item).then(function(item){return fn(item)}) : item)).then(function (result) {
          return result.filter(_undefined)
        });
      }
      return previous;
    };
  }

  if (typeof total !== 'number') {
    task        = total;
    total       = null;
  }

  return promiseReduce(aList, _genReduceFn(task), []);
};

export default some
