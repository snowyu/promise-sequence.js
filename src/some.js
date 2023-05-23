import reduce from './reduce';
const promiseReduce = Promise.reduce || reduce;
// var Promise   = require('any-promise');
// const isArray   = Array.isArray;

function _undefined(i){
  return (i !== undefined);
}

/**
  @param {Array} aList each item as argument pass to the task.
  @param {Number} [total] optional
  @param {Promise} task promise of task function
*/
export function some(aList, total, task){
  function _genReduceFn(fn) {
    return function (previous, item){
      previous = previous.filter(_undefined);
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
