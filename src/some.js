var Promise   = require('any-promise');
var isArray   = Array.isArray;

/*
  @param aList {Array} each item as argument pass to the task.
  @param total {Number} optional
  @param task {Promise} promise of task function
*/
function _undefined(i){
  return (i !== void 0);
}
module.exports = function some(aList, total, task){
  function _genReduceFn(fn) {
    return function (previous, item){
      previous = previous.filter(_undefined);
      if (!total || previous.length < total) {
        previous = Promise.all(previous.concat(fn ? fn(item) : item)).filter(_undefined);
      }
      return previous;
    };
  }

  if (typeof total !== 'number') {
    task        = total;
    total       = null;
  }

  return Promise.reduce(aList, _genReduceFn(task), []);
};
