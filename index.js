
/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter');
var indexof = require('indexof');
var slice = [].slice;

/**
 * Expose `collection`.
 */

exports = module.exports = collection;

/**
 * Expose `collection` of collections.
 */

exports.collection = {};

/**
 * Expose `Collection`.
 */

exports.Collection = Collection;

/**
 * Instantiate a new `Collection`.
 */

function collection(name, array) {
  if ('string' !== typeof name)
    return new Collection(name);

  if (exports.collection[name] && !array)
    return exports.collection[name];

  return exports.collection[name] = new Collection(array, name);
}

/**
 * Instantiate a new `Collection`.
 */

function Collection(array, name) {
  this.array = array || [];
  this.length = this.array.length;
  if (name) this.name = name;
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

Collection.prototype.remove = function(item){
  this.splice(this.indexOf(item), 1);
};

Collection.prototype.indexOf = function(item){
  return indexof(this.array, item);
};

Collection.prototype.reset = function(array){
  var prev = this.array;
  this.array = array;
  this.emit('reset', array, prev);
};

Collection.prototype.toArray = function(){
  return this.array;
};

/**
 * Subscribe to a query.
 *
 * @param {Query} query
 * @return {Collection} self
 */

Collection.prototype.subscribe = function(query){
  var self = this;
  this.unsubscribe();
  this._query = query;

  function fn(record) {
    switch (query.type) {
      case 'create':
        self.push(record);
        break;
      case 'update':
        break;
      case 'remove':
        self.remove(record);
        break;
    }
  }

  query.__collectionFn__ = fn;
  query.subscribe(fn);
  return this;
};

/**
 * Unsubscribe from current query.
 *
 * @return {Collection} self
 */

Collection.prototype.unsubscribe = function(){
  if (!this._query) return this;

  this._query.unsubscribe(this._query.__collectionFn__);
  delete this._query;
  return this;
};

/**
 * @api private
 */

Collection.prototype.apply = function(method, args){
  return this.array[method].apply(this.array, args);
};