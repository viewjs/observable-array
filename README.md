# Tower Collection

## Installation

```bash
$ component install tower/collection
```

## Example

```js
var collection = require('tower-collection');
```

Create a blank collection:

```js
collection(); // []
collection([]); // []
```

## API

### push

```js
collection.push(item);
collection.push(item1, item2);
```

### pop

```js
collection.pop();
```

### shift

Remove first item in array.

```js
collection.shift();
```

### unshift

Add item(s) to beginning of array.

```js
collection.unshift(item);
collection.unshift(item1, item2);
```

### splice(index, length, item)

Modify the original array.

```js
collection.splice(1, 2, item);
```

### length

```js
collection.length;
```

## Notes

The `collection` is only necessary to bind lists of data (such as queries) to the DOM. It just makes it easier to listen for changes to an array. In most other cases you can just use plain arrays and don't need the power of dirty tracking.

## Licence

MIT