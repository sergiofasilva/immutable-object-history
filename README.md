# immutable-object-history

Immutable objects with state history.

## Installation

```bash
npm install immutable-object-history --save
```

### Basic Example

```typescript
'use strict';
const ImmutableObjectHistory = require('immutable-object-history');
const { get, set, list, at } = ImmutableObjectHistory();
/*
ImmutableObjectHistory accepts as an argument an object with the functions:
    - get(key)
    - set(key, object)

Samples: Map object, redis client, ...

if empty, by default, ImmutableObjectHistory usage Map object.
*/

const userV1 = { id: 1, name: 'Name', age: 24 };
const key = `user:${id}`;
const setUserV1 = set(key, userV1);
console.log(setUserV1); // { id: 1, name: 'Name', age: 24 };
const userV2 = { age: 25, genre: 'male' };
const setUserV2 = set(key, userV2);
console.log(setUserV2); // { id: 1, name: 'Name', age: 25, genre: 'male' };
```
