
/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter')
  , slice = [].slice;

/**
 * Expose `collection`.
 */

exports = module.exports = collection;

/**
 * Expose `Collection`.
 */

exports.Collection = Collection;

/**
 * Instantiate a new `Collection`.
 */

function collection(array) {
  return new Collection(array);
}

/**
 * Instantiate a new `Collection`.
 */

function Collection(array) {
  this.array = array || [];
  this.length = this.array.length;
}

/**
 * Mixin `Emitter`.
 */

Emitter(Collection.prototype);

Collection.prototype.push = function(){
  var startIndex = this.array.length;
  var result = this.apply('push', arguments);
  this.length = this.array.length;
  if (this.hasListeners('add'))
    this.emit('add', this.array.slice(startIndex, this.length), startIndex);
  return result;
};

Collection.prototype.pop = function(){
  var startIndex = this.array.length;
  var result = this.apply('pop', arguments);
  this.length = this.array.length;
  if (this.hasListeners('remove'))
    this.emit('remove', [result], startIndex - 1);
  return result;
};

Collection.prototype.shift = function(){
  var startIndex = this.array.length;
  var result = this.apply('shift', arguments);
  this.length = this.array.length;
  if (this.hasListeners('remove'))
    this.emit('remove', [result], 0);
  return result;
};

Collection.prototype.unshift = function(){
  this.apply('unshift', arguments);
  this.length = this.array.length;
};

// XXX: maybe it emits a `replace` event if 
// it both adds and removes at the same time.
Collection.prototype.splice = function(index, length){
  var startIndex = this.array.length;
  var removed = this.apply('splice', arguments);
  this.length = this.array.length;
  if (removed.length && this.hasListeners('remove')) {
    this.emit('remove', removed, index);
  }
  if (arguments.length > 2 && this.hasListeners('add')) {
    this.emit('add', slice.call(arguments, 2), index);
  }
  return removed;
};

Collection.prototype.forEach = function(fn, binding){
  this.apply('forEach', arguments);
};

Collection.prototype.reverse = function(){
  this.apply('reverse', arguments);
  this.emit('refresh');
};

Collection.prototype.sort = function(){
  this.apply('sort', arguments);
  this.emit('refresh');
};

Collection.prototype.toArray = function(){
  return this.array;
};

/**
 * @api private
 */

Collection.prototype.apply = function(method, args){
  return this.array[method].apply(this.array, args);
};