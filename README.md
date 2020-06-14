### Promise Sequence [![npm](https://img.shields.io/npm/v/promise-sequence.svg)](https://npmjs.org/package/promise-sequence)

[![Build Status](https://img.shields.io/travis/snowyu/promise-sequence.js/master.png)](http://travis-ci.org/snowyu/promise-sequence.js)
[![Code Climate](https://codeclimate.com/github/snowyu/promise-sequence.js/badges/gpa.svg)](https://codeclimate.com/github/snowyu/promise-sequence.js)
[![Test Coverage](https://codeclimate.com/github/snowyu/promise-sequence.js/badges/coverage.svg)](https://codeclimate.com/github/snowyu/promise-sequence.js/coverage)
[![downloads](https://img.shields.io/npm/dm/promise-sequence.svg)](https://npmjs.org/package/promise-sequence)
[![license](https://img.shields.io/npm/l/promise-sequence.svg)](https://npmjs.org/package/promise-sequence)


Promise Sequence execution tasks.


## API

### sequence(tasks[, args][, self])


```js
var sequence = require('promise-sequence');
var resultsPromise = sequence(arrayOfTasks);
```

Run an array of tasks in sequence, without overlap. Each task will be called with the arguments passed to when.sequence(), and each may return a promise or a value.

When all tasks have completed, the returned promise will resolve to an array containing the result of each task at the corresponding array position. The returned promise will reject when any task throws or returns a rejection.

### pipeline(tasks[, args][, self])

```js
var pipeline = require('promise-sequence/lib/pipeline');
var resultsPromise = pipeline(arrayOfTasks);
```
Run an array of tasks in sequence, without overlap, similarly to `sequence`. The first task (e.g. arrayOfTasks[0]) will be called with the arguments passed to when.pipeline(), and each subsequence task will be called with the result of the previous task.

Again, each may return a promise or a value. When a task returns a promise, the fully resolved value will be passed to the next task.

When all tasks have completed, the returned promise will resolve to the result of the last task. The returned promise will reject when any task throws or returns a rejection.


### any(list, task)

```js
var any = require('promise-sequence/lib/any');
var fs  = require('fs');
var readFile = Promise.promisify(fs.readFile, fs);

var readFileAndIgnoreError = function (aFile, aOptions) {
  return readFile(aFile,aOptions).catch(function(){});
}

any(['./config.yml', './config.json'], readFileAndIgnoreError).then(function(result){
  console.log(result);
});
```


like the bluebird.any, but it is sequence execution.
need `Promise.reduce`(patch already included).

### some(list, total, task)

```js
var some = require('promise-sequence/lib/some');
var fs  = require('fs');
var readFile = Promise.promisify(fs.readFile, fs);
var readFileAndIgnoreError = function (aFile, aOptions) {
  return readFile(aFile,aOptions).catch(function(){});
}

some(['./config.yml', './config.json'], 1, readFileAndIgnoreError).then(function(result){
  console.log(result); //it's an array.
});
```

like the bluebird.some, but it is sequence execution.
need `Promise.reduce`(patch already included).

### Promise.reduce(iteratable, reducer, initialValue): Promise<any>

* reducer: `function<T>(<T> accumulator, any item, int index, int length): Promise<T>|T`

Given an Iterable(arrays are Iterable), or a promise of an Iterable, which produces promises (or a mix of promises and values), iterate over all the values in the Iterable into an array and reduce the array to a value using the given reducer function.

If the reducer function returns a promise, then the result of the promise is awaited, before continuing with next iteration. If any promise in the array is rejected or a promise returned by the reducer function is rejected, the result is rejected as well.

Read given files sequentially while summing their contents as an integer. Each file contains just the text 10.

```js
Promise.reduce(["file1.txt", "file2.txt", "file3.txt"], function(total, fileName) {
    return fs.readFileAsync(fileName, "utf8").then(function(contents) {
        return total + parseInt(contents, 10);
    });
}, 0).then(function(total) {
    //Total is 30
});
```

## usage

## License

MIT
