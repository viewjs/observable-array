var collection = 'undefined' == typeof window
  ? require('..')
  : require('tower-collection'); // how to do this better?

var assert = require('assert');

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
    })
  });
});
