var Promise   = require('any-promise');
var isArray   = Array.isArray;
var cast      = Promise.cast || Promise.resolve;

module.exports = function sequence(tasks, aArgs, self){
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
      result.push(current = current.thenReturn().then(function(){return task.apply(self, args);}));
    });
    return Promise.all(result);
  });
};
