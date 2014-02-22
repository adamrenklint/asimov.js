describe('WBSingleton', function () {

  'use strict';

  var Topic;
  var noop = function () {};

  beforeEach(function (done) {
    requirejs([
      'WBSingleton'
    ], function (WBSingleton) {
      Topic = WBSingleton;
      done();
    });
  });

  describe('#initialize', function () {

    it('should throw', function () {

      expect(function () {
        new Topic();
      }).to.throw(Error);

      expect(function () {
        new (Topic.extend());
      }).to.throw(Error);
    });
  });

  describe('#extend', function () {

    it('should return another singleton', function () {

      var Singleton = Topic.extend({
        'foo': noop,
        'bar': 42
      });

      expect(function () {
        new Singleton();
      }).to.throw(Error);

      expect(Singleton.foo).to.equal(noop);
      expect(Singleton.bar).to.equal(42);
      expect(Singleton.extend).to.equal(Topic.extend);
    });

    it('should apply mixins', function () {

      var spy = sinon.spy();
      var mixins = [
        { 'applyTo': spy }
      ];

      var Singleton = Topic.extend({
        'mixins': mixins
      });

      expect(Singleton.mixins).to.equal(undefined);
      expect(spy).to.have.been.called;
    });

    it('should extend from WBSingleton, if context is lost', function () {

      var Base = Topic.extend({
        'foo': 1
      });

      var extend = Base.extend;
      var Singleton = extend({
        'bar': 2
      });

      expect(Singleton.foo).to.equal(undefined);
      expect(Singleton.bar).to.equal(2);
    });
  });
});