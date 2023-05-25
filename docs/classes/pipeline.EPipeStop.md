[promise-sequence](../README.md) / [Exports](../modules.md) / [pipeline](../modules/pipeline.md) / EPipeStop

# Class: EPipeStop

[pipeline](../modules/pipeline.md).EPipeStop

Error class used to stop a pipeline execution.

## Hierarchy

- `Error`

  ↳ **`EPipeStop`**

## Table of contents

### Constructors

- [constructor](pipeline.EPipeStop.md#constructor)

### Properties

- [message](pipeline.EPipeStop.md#message)
- [name](pipeline.EPipeStop.md#name)
- [result](pipeline.EPipeStop.md#result)
- [stack](pipeline.EPipeStop.md#stack)

## Constructors

### constructor

• **new EPipeStop**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

Error.constructor

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1060

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1055

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1054

___

### result

• **result**: `any`

the return result when stopping the entire sequence.

#### Defined in

[src/pipeline.js:12](https://github.com/snowyu/promise-sequence.js/blob/550b1ff/src/pipeline.js#L12)

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1056
