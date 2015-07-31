var Promise   = require('any-promise');

var isArray   = Array.isArray;

/*
 @param aList {Array} each item as argument pass to the task.
 @param task {Promise} promise of task function
*/

module.exports = function any(aList, task){
  function _genReduceFn(fn) {
    return function (previous, item){
      if (previous == null) {
        previous = fn ? fn(item) : item;
      }
      return previous;
    };
  }

  return Promise.reduce(aList, _genReduceFn(task), null);
};
