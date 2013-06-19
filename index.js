
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
 * Create or return an existing `Collection`.
 *
 * @param {String} name Collection name.
 * @param {Array} array The data to store on the collection.
 * @return {Collection} A Collection instance.
 * @api public
 */

function collection(name, array) {
  if ('string' !== typeof name)
    return new Collection(name);

  if (exports.collection[name] && !array)
    return exports.collection[name];

  return exports.collection[name] = new Collection(array, name);
}

/**
 * Class representing a collection.
 *
 * @class
 * @param {Array} array The data stored on the collection.
 * @param {String} name The collection name.
 * @api public
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

/**
 * Add an element to the end of the collection.
 *
 * @return {Integer} The collection length.
 * @api public
 */

Collection.prototype.push = function(){
  var startIndex = this.array.length;
  var result = this.apply('push', arguments);
  this.length = this.array.length;
  if (this.hasListeners('add'))
    this.emit('add', this.array.slice(startIndex, this.length), startIndex);
  return result;
};

/**
 * Remove the last element from the collection.
 *
 * @return {Integer} The collection length.
 * @api public
 */

Collection.prototype.pop = function(){
  var startIndex = this.array.length;
  var result = this.apply('pop', arguments);
  this.length = this.array.length;
  if (this.hasListeners('remove'))
    this.emit('remove', [result], startIndex - 1);
  return result;
};

/**
 * Remove the first element from the collection.
 *
 * @return {Integer} The collection length.
 * @api public
 */

Collection.prototype.shift = function(){
  var startIndex = this.array.length;
  var result = this.apply('shift', arguments);
  this.length = this.array.length;
  if (this.hasListeners('remove'))
    this.emit('remove', [result], 0);
  return result;
};

/**
 * Add an element to the beginning of the collection.
 *
 * @api public
 */

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

/**
 * Remove a specific element from the collection.
 * 
 * @param {Object} item The element to remove.
 * @api public
 */

Collection.prototype.remove = function(item){
  this.splice(this.indexOf(item), 1);
};

/**
 * Return the index of a specific element in the collection.
 * 
 * @param {Object} item An element in the collection.
 * @return {Integer} The element's index value or -1 if it doesn't exist in the collection.
 * @api public
 */

Collection.prototype.indexOf = function(item){
  return indexof(this.array, item);
};

/**
 * Reset the collection's data with a new set of data.
 *
 * @param {Array} array The data to store on the collection.
 * @api public
 */

Collection.prototype.reset = function(array){
  var prev = this.array;
  this.array = array;
  this.emit('reset', array, prev);
};

/**
 * Return the collection's data array.
 *
 * @return {Array} The collection's data array.
 * @api public
 */

Collection.prototype.toArray = function(){
  return this.array;
};

/**
 * Subscribe to a query.
 *
 * @chainable
 * @param {Query} query A query object.
 * @return {Collection}
 * @api public
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
 * @chainable
 * @return {Collection}
 * @api public
 */

Collection.prototype.unsubscribe = function(){
  if (!this._query) return this;

  this._query.unsubscribe(this._query.__collectionFn__);
  delete this._query;
  return this;
};

/**
 * Apply an array function on the collection's data array.
 * 
 * @param {String} method An array method property. Example: 'shift', 'push'.
 * @param {Array} args Method argument list.
 * @return {Mixed} Whatever the array method returns.
 * @api private
 */

Collection.prototype.apply = function(method, args){
  return this.array[method].apply(this.array, args);
};