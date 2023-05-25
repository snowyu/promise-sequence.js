[promise-sequence](../README.md) / [Exports](../modules.md) / any

# Module: any

## Table of contents

### References

- [default](any.md#default)

### Functions

- [any](any.md#any)

## References

### default

Renames and re-exports [any](any.md#any)

## Functions

### any

▸ **any**(`aList`, `task`): `Promise`<`any`\>

Executes a provided task function with a list of arguments sequentially until the result is not `null`.

**`Example`**

```ts
// Find the first even number in an array using the any() function.
const numbers = [1, 3, 5, 6, 7];
const evenNumber = await any(numbers, (num) => {
  if (num % 2 === 0) {
    return num;
  }
});
console.log(evenNumber); // Output: 6

// Find the first string with length greater than 5 characters using the any() function.
const strings = ["hello", "world", "foo", "bar"];
const longString = await any(strings, (str) => {
  if (str.length >5) {
    return str;
  }
});
console.log(longString); // Output: "world"
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `aList` | `any`[] | The list of arguments to pass into the task function. |
| `task` | `Promise`<`any`\> | The function to execute with the arguments. |

#### Returns

`Promise`<`any`\>

A promise that resolves to the result of the task function, or null if no result is found.

#### Defined in

[src/any.js:31](https://github.com/snowyu/promise-sequence.js/blob/550b1ff/src/any.js#L31)
