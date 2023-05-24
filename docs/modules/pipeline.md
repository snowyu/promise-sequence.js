[promise-sequence](../README.md) / [Exports](../modules.md) / pipeline

# Module: pipeline

## Table of contents

### References

- [default](pipeline.md#default)

### Classes

- [EPipeStop](../classes/pipeline.EPipeStop.md)

### Functions

- [pipeline](pipeline.md#pipeline)

## References

### default

Renames and re-exports [pipeline](pipeline.md#pipeline)

## Functions

### pipeline

▸ **pipeline**(`tasks`, `aArgs`, `self?`): `Promise`<`any`\>

Run a set of task functions in sequence, passing the result
of the previous as an argument to the next.  Like a shell
pipeline, e.g. `cat file.txt | grep 'foo' | sed -e 's/foo/bar/g'

@param {Array|function} tasks An array of functions to execute in sequence, or a single function to execute.
@param {Array|*} [initialArgs]  the arguments to be passed to the first task or the `this` argument to be passed to the first task
@param {*} [self] `this` argument to be passed to the first task
@return {Promise} A promise that resolves to the final result of the pipeline.
@throws {EPipeStop} Thrown when a task in the pipeline throws an `EPipeStop` error to stop the pipeline execution.

**`Example`**

```ts
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
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `tasks` | `Function` \| `any`[] |
| `aArgs` | `any` |
| `self?` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/pipeline.js:39](https://github.com/snowyu/promise-sequence.js/blob/453a011/src/pipeline.js#L39)
