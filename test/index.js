var collection = 'undefined' == typeof window
  ? require('..')
  : require('tower-collection'); // how to do this better?

var assert = require('assert');

describe('collection', function(){
  it('should test', function(){
    assert.equal(1 + 1, 2);
  });
});
