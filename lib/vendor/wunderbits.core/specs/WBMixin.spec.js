describe('WBMixin', function () {

  'use strict';

  var Topic;

  beforeEach(function (done) {
    requirejs([
      'WBMixin'
    ], function (Mixin) {
      Topic = Mixin;
      done();
    });
  });

  describe('#extend', function () {

    it('should extend behavior properties', function () {

      var BehaviorMixin = Topic.extend({
        'foo': 'bar'
      });

      BehaviorMixin.should.not.be.a('function');
      BehaviorMixin.extend.should.be.a('function');
      BehaviorMixin.applyTo.should.be.a('function');

      BehaviorMixin.Behavior.foo.should.equal('bar');
    });

    it('should extend static properties', function () {

      var StaticMixin = Topic.extend({}, {
        'staticFoo': 'bar'
      });

      StaticMixin.should.not.be.a('function');
      StaticMixin.extend.should.be.a('function');
      StaticMixin.applyTo.should.be.a('function');

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

    describe('should throw for a non class', function () {

      var types = {
        'object': {},
        'fakeClass1': {
          'prototype': {
          }
        },
        'fakeClass2': {
          'prototype': {
            'constructor': function () {}
          }
        }
      };

      var Mixin;
      beforeEach(function () {
        Mixin = Topic.extend();
      });

      Object.keys(types).forEach(function (type) {
        it(type, function () {
          expect(function () {
            Mixin.applyToClass(types[type]);
          }).to.throw(Error);
        });
      });
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

  describe('derived mixins', function () {

    it('should be able to override & call super methods', function () {

      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();

      var BaseMixin = Topic.extend({
        'foo': spy1,
        'bar': spy2
      });

      var _super = BaseMixin.Behavior;
      var DerivedMixin = BaseMixin.extend({
        'foo': function () {
          return _super.foo.apply(this, arguments);
        },
        'bar': spy3
      });

      var instance = {};
      DerivedMixin.applyTo(instance);

      var spy4 = sinon.spy(instance, 'foo');
      instance.foo();
      expect(spy4).to.have.been.calledOnce;
      expect(spy1).to.have.been.calledOnce;
      expect(spy1).to.have.been.calledAfter(spy4);
      instance.bar();
      expect(spy2).to.not.have.been.called;
      expect(spy3).to.have.been.calledOnce;
    });
  });
});