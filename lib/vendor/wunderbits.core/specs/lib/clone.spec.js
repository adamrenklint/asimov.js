describe('lib/clone', function () {

  'use strict';

  var original = {
    'a': 5,
    'b': function () {},
    'c': {
      'd': {
        'e': 42
      }
    },
    'f': null,
    'g': new Date(),
    'h': false,
    'j': [1, 2, 3]
  };

  var topic;
  beforeEach(function (done) {
    requirejs(['lib/clone'], function (clone) {
      topic = clone;
      done();
    });
  });

  it('should be a function', function () {
    expect(topic).to.be.a('function');
  });

  it('should create an exact copy of an object', function () {
    var copy = topic(original, true);

    expect(copy).to.not.equal(original);
    expect(copy).to.deep.equal(original);

    expect(copy.c).to.not.equal(original.c);
    expect(copy.c).to.deep.equal(original.c);

    expect(copy.j).to.not.equal(original.j);
    expect(copy.j).to.deep.equal(original.j);
  });

});