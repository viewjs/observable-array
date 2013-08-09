
/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter');

/**
 * Define property method.
 */

var defineProperty;

try {
  // IE8 has it but it only works on DOM elements.
  Object.defineProperty({}, 'foo', { value: true });
  defineProperty = Object.defineProperty;
} catch (err) {
  defineProperty = function(obj, prop, desc){
    obj[prop] = desc.value;
  };
}

var slice = Array.prototype.slice;
var proto = [];

/**
 * Mixin `Emitter`.
 */

Emitter(proto);

/**
 * Define methods.
 */

var methods = {
  pop: pop,
  push: push, 
  reverse: reverse,
  shift: shift,
  sort: sort,
  splice: splice,
  unshift: unshift
};

for (var method in methods)
  defineMethod(method, methods[method]);

function defineMethod(name, fn) {
  defineProperty(proto, name, { value: fn });
}

// if a modern browser
if ({}.__proto__) {
  var wrap = function wrap(arr) {
    if (arr.__observable__) return arr;
    arr.__observable__ = true;
    arr.__proto__ = proto;
    return arr;
  }

  var unwrap = function unwrap(arr) {
    delete arr.__observable__;
    arr.__proto__ = Array.prototype;
    return arr;
  }
} else {
  var wrap = function wrap(arr) {
    if (arr.__observable__) return arr;
    arr.__observable__ = true;
    for (var name in methods) {
      defineProperty(arr, name, {
        value: proto[name],
        configurable: true
      });
    }
    return arr;
  };

  var unwrap = function unwrap(arr) {
    for (var name in methods) {
      delete arr[name];
    }
    delete arr.__observable__;
    return arr;
  };
}

/**
 * Expose `wrap`.
 */

exports = module.exports = wrap;

/**
 * Expose `unwrap`.
 */

exports.unwrap = unwrap;

/**
 * Add an element to the end of the collection.
 *
 * @return {Integer} The collection length.
 * @api public
 */

function push() {
  var startIndex = this.length;
  var result = Array.prototype.push.apply(this, arguments);
  if (this.hasListeners('add'))
    this.emit('add', this.slice(startIndex, this.length), startIndex);
  return result;
}

/**
 * Remove the last element from the collection.
 *
 * @return {Integer} The collection length.
 * @api public
 */

function pop() {
  var startIndex = this.length;
  var result = Array.prototype.pop.apply(this, arguments);
  if (this.hasListeners('remove'))
    this.emit('remove', [result], startIndex - 1);
  return result;
}

/**
 * Remove the first element from the collection.
 *
 * @return {Integer} The collection length.
 * @api public
 */

function shift() {
  var startIndex = this.length;
  var result = Array.prototype.shift.apply(this, arguments);
  if (this.hasListeners('remove'))
    this.emit('remove', [result], 0);
  return result;
}

/**
 * Add an element to the beginning of the collection.
 *
 * @api public
 */

function unshift() {
  var length = this.length;
  var result = Array.prototype.unshift.apply(this, arguments);
  if (this.hasListeners('add'))
    this.emit('add', this.slice(0, this.length - length), 0);
  return result;
}

// XXX: maybe it emits a `replace` event if 
// it both adds and removes at the same time.
function splice(index, length) {
  var startIndex = this.length;
  var removed = Array.prototype.splice.apply(this, arguments);
  this.length = this.length;
  if (removed.length && this.hasListeners('remove')) {
    this.emit('remove', removed, index);
  }
  if (arguments.length > 2 && this.hasListeners('add')) {
    this.emit('add', slice.call(arguments, 2), index);
  }
  return removed;
}

function reverse() {
  var result = Array.prototype.reverse.apply(this, arguments);
  this.emit('sort');
  return result;
}

function sort() {
  var result = Array.prototype.sort.apply(this, arguments);
  this.emit('sort');
  return result;
}

/**
 * Reset the collection's data with a new set of data.
 *
 * @param {Array} arr The data to store on the collection.
 * @api public
 */

function reset(arr) {
  this.emit('reset', arr);
}

/**
 * Apply an array function on the collection's data array.
 * 
 * @param {String} name An array method property. Example: 'shift', 'push'.
 * @param {Array} args Method argument list.
 * @return {Mixed} Whatever the array method returns.
 * @api private
 */

function apply(name, args) {
  //this.__updating__ = true;
  return Array.prototype[name].apply(this, args);
  //delete this.__updating__;
};