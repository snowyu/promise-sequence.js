[promise-sequence](../README.md) / [Exports](../modules.md) / finally

# Module: finally

## Table of contents

### References

- [default](finally.md#default)

### Functions

- [promiseFinally](finally.md#promisefinally)

## References

### default

Renames and re-exports [promiseFinally](finally.md#promisefinally)

## Functions

### promiseFinally

▸ **promiseFinally**(`fn`): `Promise`<`any`\>

Adds a finally clause to a promise, which executes a function after the promise is settled, regardless of whether it was fulfilled or rejected.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | `Function` | The function to execute after the promise is settled. |

#### Returns

`Promise`<`any`\>

- A promise that resolves with the result of the original promise, or rejects with the reason for rejection of the original promise.

#### Defined in

[src/finally.js:8](https://github.com/snowyu/promise-sequence.js/blob/453a011/src/finally.js#L8)
