# Observable Array

Makes any array an event emitter.

## Installation

node.js:

```bash
npm install tower-observable-array
```

browser:

```bash
component install tower/observable-array
```

## Example

```js
var observable = require('tower-observable-array');
var arr = [ 'a', 'b', 'c' ];
observable(arr);
arr.on('add', function(){
  assert('d' === arr[3]);
});
arr.push('d');
```

## Notes

- http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/#wrappers_prototype_chain_injection

## Licence

MIT