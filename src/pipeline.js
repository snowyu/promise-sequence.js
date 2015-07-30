var Promise   = require('any-promise');
var isArray   = Array.isArray;
var cast      = Promise.cast || Promise.resolve;

module.exports = function pipeline(tasks, args, self){
  if (!isArray(args)) {
    self = args;
    args = void 0;
  }
  if (!isArray(tasks)) tasks = [tasks];
  if (!self) self = this;
  var current = cast.call(Promise);
  var result = [];
  result.push(current = current.then(function(){return tasks[0].apply(self, args);}));
  tasks.slice(1).forEach(function(task){
    result.push(current = current.then(task));
  });
  return Promise.all(result);
};
