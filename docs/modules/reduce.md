[promise-sequence](../README.md) / [Exports](../modules.md) / reduce

# Module: reduce

## Table of contents

### References

- [default](reduce.md#default)

### Functions

- [reduce](reduce.md#reduce)

## References

### default

Renames and re-exports [reduce](reduce.md#reduce)

## Functions

### reduce

▸ **reduce**(`iterator`, `reducer`, `initialValue?`): `Promise`<`any`\>

Reduces an iterable to a single value using the provided reducer function and an optional initial value, returning a Promise that resolves to the resulting value.

**`Throws`**

- If the reducer is not a function or the iterator is not iterable.

**`Example`**

```ts
const myArray = [1, 2, 3, 4, 5];
const myReducer = (accumulator, currentValue) => accumulator + currentValue;
reduce(myArray, myReducer).then((result) => {
// result will be 15
});
const mySet = new Set([1, 2, 3, 4, 5]);
reduce(mySet, myReducer, 10).then((result) => {
// result will be 25
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `iterator` | `Iterable`<`any`\> | The iterable to reduce. |
| `reducer` | `Function` | The reducer function to apply to each element in the iterable. Takes four arguments (accumulator, currentValue, currentIndex, array) and returns the new value of the accumulator. |
| `initialValue?` | `any` | An optional initial value for the accumulator. If not provided, the first element in the iterable will be used as the initial value. |

#### Returns

`Promise`<`any`\>

- A Promise that resolves to the resulting value of the reduction.

#### Defined in

[src/reduce.js:26](https://github.com/snowyu/promise-sequence.js/blob/550b1ff/src/reduce.js#L26)
