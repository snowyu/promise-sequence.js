require('./reduce')
// var Promise   = require('any-promise');
var isArray   = Array.isArray;

/*
  @param aList {Array} each item as argument pass to the task.
  @param total {Number} optional
  @param task {Promise} promise of task function
*/
function _undefined(i){
  return (i !== void 0);
}

function some(aList, total, task){
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

  return Promise.reduce(aList, _genReduceFn(task), []);
};

module.exports = some
module.exports.default = some
