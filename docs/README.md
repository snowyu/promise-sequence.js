promise-sequence / [Exports](modules.md)

### Promise Sequence [![npm](https://img.shields.io/npm/v/promise-sequence.svg)](https://npmjs.org/package/promise-sequence)

[![Build Status](https://img.shields.io/travis/snowyu/promise-sequence.js/master.png)](http://travis-ci.org/snowyu/promise-sequence.js)
[![Code Climate](https://codeclimate.com/github/snowyu/promise-sequence.js/badges/gpa.svg)](https://codeclimate.com/github/snowyu/promise-sequence.js)
[![Test Coverage](https://codeclimate.com/github/snowyu/promise-sequence.js/badges/coverage.svg)](https://codeclimate.com/github/snowyu/promise-sequence.js/coverage)
[![downloads](https://img.shields.io/npm/dm/promise-sequence.svg)](https://npmjs.org/package/promise-sequence)
[![license](https://img.shields.io/npm/l/promise-sequence.svg)](https://npmjs.org/package/promise-sequence)

Promise Sequence execution tasks.

## API

### `sequence(tasks[, args][, self])`

```js
import {EPipeStop, sequence} from 'promise-sequence';
// Define an array of functions to execute in sequence.
const tasks = [
  function add(a, b) { return a + b },
  function subtract(a, b) { return a - b },
  function multiply(a, b) { return a * b }
];
// Execute the sequence with arguments.
const result = await sequence(tasks, [3, 2]);
console.log(result); // Output: [5, 1, 6]
// Explanation: The arguments are 3 and 2. The first function adds them to get 5. The second function subtracts 2 from 3, resulting in-1. The third function multiplies 2 with 3, resulting 6.

const tasks = [
  function add(a, b) { return a + b },
  function stopAndRet(a, b) {
    const err = new EPipeStop()
    // apply err.result if wanna return a result else no result returned.
    err.result = a - b
    throw err
  },
  function multiply(a, b) { return a * b }
];
// Execute the sequence with arguments.
const result = await sequence(tasks, [3, 2]);
console.log(result); // Output: [5, 1], the third task can not be executed.
```

Run an array of tasks in sequence, without overlap. Each task will be called with the arguments passed to when.sequence(), and each may return a promise or a value.

When all tasks have completed, the returned promise will resolve to an array containing the result of each task at the corresponding array position. The returned promise will reject when any task throws or returns a rejection.

### `pipeline(tasks[, args][, self])`

```js
import {EPipeStop, pipeline} from 'promise-sequence';

// Define a pipeline of functions to execute.
const tasks = [
  function double(num) { return num * 2 },
  function square(num) { return num * num },
  function subtract(num) { return num - 2 }
];
// Execute the pipeline with initial arguments.
const result = await pipeline(tasks, [2]);
console.log(result); // Output: 14
// Explanation: The initial argument is 2. The first function doubles it to 4. The second function squares it to 16. The third function subtracts 2 from 16, resulting in 14.

const tasks = [
  function double(num) { return num * 2 },
  function stopAndRet(num) {
    const err = new EPipeStop()
    // apply err.result if wanna return a result else prev result will be returned.
    err.result = num * num
    throw err
  },
  function subtract(num) { return num - 2 }
];
const result = await pipeline(tasks, [2]);
console.log(result); // Output: 16
// Explanation: The initial argument is 2. The first function doubles it to 4. The second function squares it to 16 and stop the sequence.
```

Run an array of tasks in sequence, without overlap, similarly to `sequence`. The first task (e.g. arrayOfTasks[0]) will be called with the arguments passed to when.pipeline(), and each subsequence task will be called with the result of the previous task.

Again, each may return a promise or a value. When a task returns a promise, the fully resolved value will be passed to the next task.

When all tasks have completed, the returned promise will resolve to the result of the last task. The returned promise will reject when any task throws or returns a rejection.

If you wanna stop the execution of the sequence, throw the `EPipeStop` in the task to `pipeline`. This will cause the entire sequence to be aborted.

### `any(list, task)`

Executes a provided task function with a list of arguments sequentially until the result is not `null`.

```js
import {any} from 'promise-sequence'
import fs from 'fs'

const readFile = Promise.promisify(fs.readFile, fs);
function readFileAndIgnoreError(aFile, aOptions) {
  return readFile(aFile,aOptions).catch(function(){});
}

// Execute the readFile task with arguments in the list one by one until the result exists.
any(['./config.yml', './config.json'], readFileAndIgnoreError).then(function(result){
  console.log(result);
});

// Find the first even number in an array using the any() function.
const numbers = [1, 3, 5, 6, 7];
const evenNumber = await any(numbers, (num) => {
  if (num % 2 === 0) {
    return num;
  }
});
console.log(evenNumber); // Output: 6
```

like the bluebird.any, but it is sequence execution.
need `Promise.reduce`(patch already included).

### `some(list, total, task)`

```js
import {some} from 'promise-sequence/lib/some';
import fs from 'fs';
const readFile = Promise.promisify(fs.readFile, fs);
function readFileAndIgnoreError(aFile, aOptions) {
  return readFile(aFile,aOptions).catch(function(){});
}

some(['./config.yml', './config.json'], 1, readFileAndIgnoreError).then(function(result){
  console.log(result); //it's an array.
});
```

like the bluebird.some, but it is sequence execution.
need `Promise.reduce`(patch already included).

### `Promise.reduce(iteratable, reducer, initialValue): Promise<any>`

* reducer: `function<T>(<T> accumulator, any item, int index, int length): Promise<T>|T`

Given an Iterable(arrays are Iterable), or a promise of an Iterable, which produces promises (or a mix of promises and values), iterate over all the values in the Iterable into an array and reduce the array to a value using the given reducer function.

If the reducer function returns a promise, then the result of the promise is awaited, before continuing with next iteration. If any promise in the array is rejected or a promise returned by the reducer function is rejected, the result is rejected as well.

Read given files sequentially while summing their contents as an integer. Each file contains just the text 10.

need `Array.from`(patch already included).

```js
Promise.reduce(["file1.txt", "file2.txt", "file3.txt"], function(total, fileName) {
    return fs.readFileAsync(fileName, "utf8").then(function(contents) {
        return total + parseInt(contents, 10);
    });
}, 0).then(function(total) {
    //Total is 30
});
```

### Polyfill helpers

* `Array.from`: require('promise-sequence/lib/polyfill-array-from')
* `Promise.reduce`: require('promise-sequence/lib/polyfill-reduce')
* `Promise.prototype.finally`: require('promise-sequence/lib/polyfill-finally')

## usage

## License

MIT
