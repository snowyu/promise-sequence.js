const isArray   = Array.isArray;
// const cast      = Promise.cast || Promise.resolve;

/**
 * Error class used to stop a pipeline execution.
 *
 * @property {*} result - the return result when stopping the entire sequence.
 */
export class EPipeStop extends Error {}

/**
 * Run a set of task functions in sequence, passing the result
 * of the previous as an argument to the next.  Like a shell
 * pipeline, e.g. `cat file.txt | grep 'foo' | sed -e 's/foo/bar/g'
 *
 * @param {Array|function} tasks An array of functions to execute in sequence, or a single function to execute.
 * @param {Array|*} [initialArgs]  the arguments to be passed to the first task or the `this` argument to be passed to the first task
 * @param {*} [self] `this` argument to be passed to the first task
 * @return {Promise} A promise that resolves to the final result of the pipeline.
 * @throws {EPipeStop} Thrown when a task in the pipeline throws an `EPipeStop` error to stop the pipeline execution.
 * @example
 *
 * // Define a pipeline of functions to execute.
 * const tasks = [
 *   function double(num) { return num * 2 },
 *   function square(num) { return num * num },
 *   function subtract(num) { return num - 2 }
 * ];
 *
 * // Execute the pipeline with initial arguments.
 * const result = await pipeline(tasks, [2]);
 * console.log(result); // Output: 14
 * // Explanation: The initial argument is 2. The first function doubles it to 4. The second function squares it to 16. The third function subtracts 2 from 16, resulting in 14.
 */
export function pipeline(tasks, aArgs, self){
  if (!isArray(aArgs)) {
    self = aArgs;
    aArgs = [];
  }
  if (tasks && !isArray(tasks)) {tasks = [tasks]}
  if (!self) {self = this}
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
            result = err.result
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
