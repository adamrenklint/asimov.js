describe('createUID', function () {

  'use strict';

  var topic;
  beforeEach(function (done) {
    requirejs(['lib/createUID'], function (createUID) {
      topic = createUID;
      done();
    });
  });

  it('should be a function', function () {
    expect(topic).to.be.a('function');
  });
});