[promise-sequence](../README.md) / [Exports](../modules.md) / sequence

# Module: sequence

## Table of contents

### References

- [default](sequence.md#default)

### Functions

- [sequence](sequence.md#sequence)

## References

### default

Renames and re-exports [sequence](sequence.md#sequence)

## Functions

### sequence

▸ **sequence**(`tasks`, `aArgs`, `self?`): `Promise`<`any`\>

Run a set of task functions in sequence.  All tasks will
receive the same args.

**`Throws`**

Thrown when a task throws an `EPipeStop` error to stop the sequence execution.

**`Example`**

```ts
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
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tasks` | `Function` \| `any`[] | An array of functions to execute in sequence, or a single function to execute. |
| `aArgs` | `any` | - |
| `self?` | `any` | `this` argument to be passed to all tasks |

#### Returns

`Promise`<`any`\>

promise for an array containing
the result of each task in the array position corresponding
to position of the task in the tasks array

#### Defined in

[src/sequence.js:32](https://github.com/snowyu/promise-sequence.js/blob/550b1ff/src/sequence.js#L32)
