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

const userV1 = { id: 1, name: 'Name', age: 24 };
const key = `user:${id}`;
const setUserV1 = set(key, userV1);
//setUserV1 = { id: 1, name: 'Name', age: 24 };
const userV2 = { age: 25, genre: 'male' };
const setUserV2 = set(key, userV2);
//setUserV2 = { id: 1, name: 'Name', age: 25, genre: 'male' };
```
