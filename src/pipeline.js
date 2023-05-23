const isArray   = Array.isArray;
const cast      = Promise.cast || Promise.resolve;

export class EPipeStop extends Error {}

/**
  Run a set of task functions in sequence, passing the result
  of the previous as an argument to the next.  Like a shell
  pipeline, e.g. `cat file.txt | grep 'foo' | sed -e 's/foo/bar/g'

  @param {Array|Promise} tasks array or promise for array of task functions
  @param {Array} [initialArgs]  arguments to be passed to the first task
  @param {*} [self]  `this` argument to be passed to the first task
  @return {Promise} promise for return value of the final task
*/
export function pipeline(tasks, aArgs, self){
  if (!isArray(aArgs)) {
    self = aArgs;
    aArgs = [];
  }
  if (tasks && !isArray(tasks)) tasks = [tasks];
  if (!self) self = this;
  return Promise.all(aArgs).then(async function(args){
    if (tasks && tasks.length) {
      let result
      for (const task of tasks) {
        if (task && task.apply) {
          try {
            result = await task.apply(self, args);
            args = [result]
          } catch (err) {
            if (!(err instanceof EPipeStop)) {throw err}
            break;
          }
        } else {
          args = [task]
          result = task
        }
      }

      return result;
    } else {
      return args;
    }
  });
};

export default pipeline
