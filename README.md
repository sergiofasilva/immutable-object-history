# immutable-object-history

Immutable objects with state history.

## Installation

```bash
npm install immutable-object-history --save
```

### Basic Example

```javascript
'use strict';
import ImmutableObjectHistory from 'immutable-object-history';
const { get, set, list, listAll, at } = ImmutableObjectHistory();
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
console.log(setUserV1);
/*
Prints:
{ id: 1, name: 'Name', age: 24 };
*/
const userV2 = { age: 25, genre: 'male' };
const setUserV2 = set(key, userV2);
// or const setUserV2 = set(key)(userV2); //for a more functional programing style
console.log(setUserV2);
/*
Prints:
{ id: 1, name: 'Name', age: 25, genre: 'male' };
*/

const userAllStatesList = list(key);
console.log(userAllStatesList);
/*
Prints:
[
    {
        index: 0
        timestamp: 1646346849318,
        date: 2022-03-03T22:34:09.318Z,
        value: { id: 1, name: 'Name', age: 24 }
    },
    {
        index: 1
        timestamp: 1646346857792,
        date: 2022-03-03T22:34:17.792Z,
        value: { age: 25, genre: 'male' }
    }
]
*/

const userAllStatesListAll = listAll(key);
console.log(userAllStatesListAll);
/*
Prints:
[
    {
        index: 0
        timestamp: 1646346849318,
        date: 2022-03-03T22:34:09.318Z,
        item: { id: 1, name: 'Name', age: 24 },
        value: { id: 1, name: 'Name', age: 24 }
    },
    {
        index: 1
        timestamp: 1646346857792,
        date: 2022-03-03T22:34:17.792Z,
        item: { id: 1, name: 'Name', age: 25, genre: 'male' },
        value: { age: 25, genre: 'male' }
    }
]
*/

const userFromIndex = at(key)(-1); //empty or -1 to get last object state, or the index of the object in the list
console.log(userFromIndex);
/*
Prints:
{
    index: 1
    timestamp: 1646346857792,
    date: 2022-03-03T22:34:17.792Z,
    item: { id: 1, name: 'Name', age: 25, genre: 'male' },
    value: { age: 25, genre: 'male' }
}
*/
```

### Or Maybe a Better Alternative

```javascript
'use strict';
import ImmutableObjectHistory from 'immutable-object-history';
const { get, set, list, at } = ImmutableObjectHistory();
/*
ImmutableObjectHistory accepts as an argument an object with the functions:
    - get(key)
    - set(key, object)

Samples: Map object, redis client, ...

if empty, by default, ImmutableObjectHistory usage Map object.
*/

/**
 * You object (user) factory
 */
function User(key = '', object = {}) {
  //in progress ...
}
```
