describe('WBMixin', function () {

  var Topic, stacktrace;

  beforeEach(function (done) {
    requirejs([
      'wunderbits/WBMixin',
      'vendor/stacktrace'
    ], function (WBMixin, _stacktrace) {

      Topic = WBMixin;
      stacktrace = _stacktrace;
      done();
    });
  });

  describe('#extend', function () {

    it('should extend behavior properties', function () {

      var BehaviorMixin = Topic.extend({
        'foo': 'bar'
      });

      BehaviorMixin.should.be.a('function');
      BehaviorMixin.Behavior.foo.should.equal('bar');
    });

    it('should extend static properties', function () {

      var StaticMixin = Topic.extend({}, {
        'staticFoo': 'bar'
      });

      StaticMixin.should.be.a('function');
      StaticMixin.staticFoo.should.equal('bar');
    });

    it('should return extendable class', function () {

      var FirstLevelMixin = Topic.extend({
        'foo': 'bar',
        'boo': 'bar'
      }, {
        'staticFoo': 'bar'
      });

      var SecondLevelMixin = FirstLevelMixin.extend({
        'boo': 'overwritten'
      }, {
        'staticFoo': 'overwritten'
      });

      var ThirdLevelMixin = SecondLevelMixin.extend({
        'boo': 'overwritten again'
      }, {
        'staticFoo2': 'overwritten'
      });

      FirstLevelMixin.extend.should.be.a('function');
      FirstLevelMixin.Behavior.foo.should.equal('bar');
      FirstLevelMixin.Behavior.boo.should.equal('bar');
      FirstLevelMixin.staticFoo.should.equal('bar');

      SecondLevelMixin.extend.should.be.a('function');
      SecondLevelMixin.Behavior.foo.should.equal('bar');
      SecondLevelMixin.Behavior.boo.should.equal('overwritten');
      SecondLevelMixin.staticFoo.should.equal('overwritten');

      ThirdLevelMixin.extend.should.be.a('function');
      ThirdLevelMixin.Behavior.foo.should.equal('bar');
      ThirdLevelMixin.Behavior.boo.should.equal('overwritten again');
      ThirdLevelMixin.staticFoo.should.equal('overwritten');
      ThirdLevelMixin.staticFoo2.should.equal('overwritten');
    });
  });

  describe('#applyTo', function () {

    it('should apply mixin behavior to target', function () {

      var Mixin = Topic.extend({
        'foo': 'bar',
        'func': sinon.spy
      });

      var target = {};
      Mixin.applyTo(target);

      target.foo.should.equal('bar');
      target.func.should.be.a('function');
    });

    it('should bind target as execution context for its own methods', function (done) {

      var Mixin = Topic.extend({
        'testContext': function () {
          this.foo.should.equal('bar');
          done();
        }
      });

      var target = {
        'foo': 'bar'
      };
      var otherTarget = {};

      Mixin.applyTo(target);
      target.testContext = _.bind(target.testContext, otherTarget);
      target.testContext();
    });

    it('should not bind target as execution context for other methods', function (done) {

      var Mixin = Topic.extend({
        'foo': 'bar'
      });

      var target = {
        'testContext': function () {
          this.foo.should.equal('baz');
          done();
        }
      };
      var otherTarget = {
        'foo': 'baz'
      };

      Mixin.applyTo(target);
      target.testContext = _.bind(target.testContext, otherTarget);
      target.testContext();
    });

    it('should only bind one level of bound', function (done) {

      var Mixin = Topic.extend({
        'testDepth': function () {
          var stack = stacktrace();
          var boundCount = 0;
          _.each(stack, function (item) {
            if (~item.indexOf('bound')) {
              boundCount++;
            }
          });

          boundCount.should.be.below(2);

          done();
        }
      });

      var target = {};
      Mixin.applyTo(target);

      target.testDepth();
    });

    it('should only bind one level of bound when applying multiple mixins', function (done) {

      var mixin1Deferred = new $.Deferred();
      var Mixin1 = Topic.extend({
        'testDepth1': function () {
          var stack = stacktrace();
          var boundCount = 0;
          _.each(stack, function (item) {
            if (~item.indexOf('bound')) {
              boundCount++;
            }
          });

          boundCount.should.be.below(2);
          mixin1Deferred.resolve();
        }
      });

      var mixin2Deferred = new $.Deferred();
      var Mixin2 = Topic.extend({
        'testDepth2': function () {
          var stack = stacktrace();
          var boundCount = 0;
          _.each(stack, function (item) {
            if (~item.indexOf('bound')) {
              boundCount++;
            }
          });

          boundCount.should.be.below(2);
          mixin2Deferred.resolve();
        }
      });

      var targetDeferred = new $.Deferred();
      var target = {
        'testDepth': function () {
          var stack = stacktrace();
          var boundCount = 0;
          _.each(stack, function (item) {
            if (~item.indexOf('bound')) {
              boundCount++;
            }
          });

          boundCount.should.be.below(1);
          targetDeferred.resolve();
        }
      };
      Mixin1.applyTo(target);
      Mixin2.applyTo(target);

      target.testDepth();
      target.testDepth1();
      target.testDepth2();

      $.when(targetDeferred, mixin1Deferred, mixin2Deferred).then(done);
    });

    it('should return target', function () {

      var Mixin = Topic.extend({
        'foo': 'bar',
        'func': sinon.spy
      });

      var target = {};
      var returnTarget = Mixin.applyTo(target);

      returnTarget.should.deep.equal(target);
    });

    it('should execute mixin initializer', function () {

      var spy = sinon.spy();
      var Mixin = Topic.extend({
        'initialize': spy
      });

      var target = {};
      Mixin.applyTo(target);

      spy.should.have.been.calledOnce;
    });
  });

  describe('#applyToClass', function () {

    var Klass, spy;
    beforeEach(function () {
      spy = sinon.spy();
      Klass = function () {};
    });

    it('should throw for a non class', function () {
      var Mixin = Topic.extend();
      expect(Mixin.applyToClass.bind(null, {})).to.throw;
    });

    it('should apply mixin behavior to a class', function () {

      var Mixin = Topic.extend({
        'foo': 'bar',
        'func': spy
      });

      Mixin.applyToClass(Klass);

      var instance1 = new Klass();
      var instance2 = new Klass();

      instance1.foo.should.equal('bar');
      instance1.func.should.be.a('function');
      instance1.func.should.be.equal(instance2.func);
      instance1.func.should.be.equal(Klass.prototype.func);
      instance1.func();
      spy.should.have.been.calledOnce;
    });

    it('should return the class', function () {

      var Mixin = Topic.extend({});
      var returnClass = Mixin.applyToClass(Klass);
      returnClass.should.equal(Klass);
    });

    it('should collect initializers', function () {

      var Mixin1 = Topic.extend({
        'initialize': function () {}
      });
      var Mixin2 = Topic.extend();
      var Mixin3 = Topic.extend({
        'initialize': function () {}
      });

      Mixin1.applyToClass(Klass);
      Mixin2.applyToClass(Klass);
      Mixin3.applyToClass(Klass);

      var instance = new Klass();

      instance.initializers.should.be.instanceOf(Array);
      instance.initializers.length.should.be.equal(2);
      instance.initializers.should.be.deep.equal([
        Mixin1.Behavior.initialize,
        Mixin3.Behavior.initialize
      ]);
    });
  });
});