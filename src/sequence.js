var Promise   = require('any-promise');
var isArray   = Array.isArray;
var cast      = Promise.cast || Promise.resolve;

module.exports = function sequence(tasks, args, self){
  if (!isArray(args)) {
    self = args;
    args = void 0;
  }
  if (!isArray(tasks)) tasks = [tasks];
  if (!self) self = this;
  var current = cast.call(Promise);
  var result = [];
  tasks.forEach(function(task){
    result.push(current = current.thenReturn().then(function(){return task.apply(self, args);}));
  });
  return Promise.all(result);
};
