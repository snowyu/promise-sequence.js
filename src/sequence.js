// var Promise   = require('any-promise');
const isArray   = Array.isArray;
const cast      = Promise.cast || Promise.resolve;


/**
 * Run a set of task functions in sequence.  All tasks will
 * receive the same args.
 *
 * @param {Array|function} tasks  An array of functions to execute in sequence, or a single function to execute.
 * @param {Array|*} [args] the arguments to be passed to all tasks or the object to use as `this` when executing each function in the sequence.
 * @param {*} [self] `this` argument to be passed to all tasks
 * @return {Promise} promise for an array containing
 * the result of each task in the array position corresponding
 * to position of the task in the tasks array
 * @example
 *
 * // Define an array of functions to execute in sequence.
 * const tasks = [
 *   function add(a, b) { return a + b },
 *   function subtract(a, b) { return a - b },
 *   function multiply(a, b) { return a * b }
 * ];
 *
 * // Execute the sequence with arguments.
 * const result = await sequence(tasks, [3, 2]);
 * console.log(result); // Output: [5, 1, 6]
 * // Explanation: The arguments are 3 and 2. The first function adds them to get 5. The second function subtracts 2 from 3, resulting in-1. The third function multiplies 2 with 3, resulting 6.
 *
 */
export function sequence(tasks, aArgs, self){
  if (!isArray(aArgs)) {
    self = aArgs;
    aArgs = [];
  }
  if (!isArray(tasks)) {tasks = [tasks]}
  if (!self) {self = this}
  return Promise.all(aArgs).then(function(args){
    let current = cast.call(Promise);
    const result = [];
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

export default sequence
