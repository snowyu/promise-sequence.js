var Promise   = require('any-promise');
var isArray   = Array.isArray;

/*
 @param aList {Array} pass it as argument to the task.
 @param task {Promise} promise of task function
*/
module.exports = function some(aList, total, task){
  function _genReduceFn(fn) {
    return function (previous, item){
      previous = previous.filter(Boolean);
      if (previous.length < total)
        previous = Promise.all(previous.concat(fn(item).catch(function(){})));
      return previous;
    };
  }

  if (!isArray(aList)) aList = [aList];

  return Promise.reduce(aList, _genReduceFn(task), []);
};
