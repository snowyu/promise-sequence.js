// var Promise   = require('any-promise');
var isArray   = Array.isArray;
var cast      = Promise.cast || Promise.resolve;


/*
  Run a set of task functions in sequence.  All tasks will
  receive the same args.

  @param tasks {Array|Promise} array or promiseForArray of task functions
  @param args {Array} arguments to be passed to all tasks
  @param self {*} `this` argument to be passed to all tasks
  @return {Promise} promise for an array containing
  the result of each task in the array position corresponding
  to position of the task in the tasks array
*/
function sequence(tasks, aArgs, self){
  if (!isArray(aArgs)) {
    self = aArgs;
    aArgs = [];
  }
  if (!isArray(tasks)) tasks = [tasks];
  if (!self) self = this;
  return Promise.all(aArgs).then(function(args){
    var current = cast.call(Promise);
    var result = [];
    tasks.forEach(function(task){
      if (task && task.apply) {
        result.push(current = current.then(function(){return task.apply(self, args);}));
      } else {
        result.push(task);
      }
    });
    return Promise.all(result);
  });
};

module.exports = sequence
module.exports.default = sequence
