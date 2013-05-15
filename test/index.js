var collection = 'undefined' == typeof window
  ? require('..')
  : require('tower-collection'); // how to do this better?

var assert = 'undefined' == typeof window
  ? require('assert')
  : require('component-assert');

describe('collection', function(){
  it('should take an array', function(){
    var array = [1, 2, 3];
    var items = collection(array);
    assert(array === items.toArray());
  });

  it('should create empty array if no args passed', function(){
    var items = collection();
    assert(0 === items.toArray().length);
  });

  it('should support named collections', function(){
    var todos = collection('todos', [ { title: 'foo' } ]);
    assert(todos === collection('todos'));
  });

  it('#push', function(){
    var items = collection();
    items.push(1);
    assert('1' === items.toArray().join(','));
    assert(1 === items.length);

    var items = collection();
    items.push(1, 2, 3);
    assert('1,2,3' === items.toArray().join(','));
    assert(3 === items.length);

    var items = collection();
    items.push([1, 2, 3]);
    assert('1,2,3' === items.toArray().join(','));
    assert(1 === items.length);
  });

  describe('events', function(){
    it('#push', function(){
      var calls = [];
      var items = collection();
      items
        .on('add', function(items, startIndex){
          calls.push({ items: items, i: startIndex });
        });
      items.push(1);
      items.push(1, 2, 3);
      items.push([1, 2, 3]);
      assert(3 === calls.length);
      assert(0 === calls[0].i);
      assert('1' === calls[0].items.join(','));
      assert(1 === calls[1].i);
      assert('1,2,3' === calls[1].items.join(','));
      assert(4 === calls[2].i);
      assert('1,2,3' === calls[2].items.join(','));
    });

    it('#pop', function(){
      var calls = [];
      var items = collection();
      items
        .on('remove', function(items, startIndex){
          calls.push({ items: items, i: startIndex });
        });
      items.push(1, 2, 3, 4, 5, 6);
      items.pop();
      items.pop();
      assert(2 === calls.length);
      assert(5 === calls[0].i);
    });

    it('#shift', function(){
      var calls = [];
      var items = collection();
      items
        .on('remove', function(items, startIndex){
          calls.push({ items: items, i: startIndex });
        });
      items.push(1, 2, 3, 4, 5, 6);
      items.shift();
      items.shift();
      assert(2 === calls.length);
      assert(0 === calls[0].i);
    });

    it('#splice', function(){
      var calls = [];
      var items = collection();
      items.push(1, 2, 3, 4, 5, 6);
      items
        .on('add', function(items, startIndex){
          calls.push({ type: 'add', items: items, i: startIndex });
        })
        .on('remove', function(items, startIndex){
          calls.push({ type: 'remove', items: items, i: startIndex });
        });
      
      // remove
      items.splice(2, 1);
      assert('remove' === calls[0].type);
      assert(1 === calls[0].items.length);
      assert(3 === calls[0].items[0]); // removed `3`

      // add
      items.splice(2, 0, 3);
      assert('add' === calls[1].type);
      assert(1 === calls[1].items.length);
      assert(3 === calls[1].items[0]); // removed `3`

      // remove + add (replace)
      items.splice(2, 2, 100, 200);
      assert('remove' === calls[2].type);
      assert('3,4' === calls[2].items.join(','));
      assert(2 === calls[2].i);
      assert('add' === calls[3].type);
      assert('100,200' === calls[3].items.join(','));
      assert(2 === calls[3].i);
    });
  });
});
