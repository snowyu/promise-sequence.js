var Promise   = require('any-promise');
var isArray   = Array.isArray;

/*
 @param aList {Array} pass it as argument to the task.
 @param task {Promise} promise of task function
*/
module.exports = function any(aList, task){
  function _genReduceFn(fn) {
    return function (previous, item){
      if (previous == null)
        previous = fn(item).catch(function(){});
      return previous;
    };
  }

  if (!isArray(aList)) aList = [aList];

  return Promise.reduce(aList, _genReduceFn(task), null);
};
