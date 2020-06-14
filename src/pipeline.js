// var Promise   = require('any-promise');
var isArray   = Array.isArray;
var cast      = Promise.cast || Promise.resolve;

/*
  Run a set of task functions in sequence, passing the result
  of the previous as an argument to the next.  Like a shell
  pipeline, e.g. `cat file.txt | grep 'foo' | sed -e 's/foo/bar/g'

  @param tasks {Array|Promise} array or promise for array of task functions
  @param initialArgs {Array} arguments to be passed to the first task
  @param self {*} `this` argument to be passed to the first task
  @return {Promise} promise for return value of the final task
*/
function pipeline(tasks, aArgs, self){
  if (!isArray(aArgs)) {
    self = aArgs;
    aArgs = [];
  }
  if (tasks && !isArray(tasks)) tasks = [tasks];
  if (!self) self = this;
  return Promise.all(aArgs).then(function(args){
    if (tasks && tasks.length) {
      var current = cast.call(Promise);
      current = current.then(function(){
        var task = tasks[0];
        return task && task.apply ? task.apply(self, args) : task;
      });
      tasks.slice(1).forEach(function(task){
        current = current.then(typeof task === 'function' ? task : function(){return task});
      });
      return current;
    } else {
      return args;
    }
  });
};

module.exports = pipeline
module.exports.default = pipeline
