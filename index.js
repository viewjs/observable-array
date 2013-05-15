
/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter')
  , indexof = require('indexof')
  , isArray = require('part-is-array');

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
  this.apply('push', arguments);
  this.length = this.array.length;
  if (this.hasListeners('add'))
    this.emit('add', this.array.slice(startIndex, this.length), startIndex);
  return this;
};

Collection.prototype.pop = function(){
  this.apply('pop', arguments);
  this.length = this.array.length;
};

Collection.prototype.shift = function(){
  this.apply('shift', arguments);
  this.length = this.array.length;
};

Collection.prototype.unshift = function(){
  this.apply('unshift', arguments);
  this.length = this.array.length;
};

Collection.prototype.splice = function(index, length, item){
  this.apply('splice', arguments);
  this.length = this.array.length;
};

Collection.prototype.slice = function(index, length, item){
  var result = this.apply('slice', arguments);
  this.length = this.array.length;
  return result;
};

Collection.prototype.forEach = function(fn, binding){
  this.apply('forEach', arguments);
};

Collection.prototype.indexOf = function(){
  this.apply('indexOf', arguments);
};

Collection.prototype.reverse = function(){
  this.apply('reverse', arguments);
};

Collection.prototype.sort = function(){
  this.apply('sort', arguments);
};

Collection.prototype.toArray = function(){
  return this.array;
};

/**
 * @api private
 */

Collection.prototype.apply = function(method, args){
  this.array[method].apply(this.array, args);
};