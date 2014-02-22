describe('WBClass', function () {

  'use strict';

  var Topic;

  beforeEach(function (done) {
    requirejs([
      'WBClass'
    ], function (WBClass) {
      Topic = WBClass;
      done();
    });
  });

  describe('class constructor', function () {

    it('should use parent as constructor, if none is defined', function () {

      var Klass = sinon.spy();
      var ExtendedClass = Topic.extend.call(Klass, {});

      new ExtendedClass();
      expect(Klass).to.have.been.calledOnce;
    });

    it('should use a custom constructor, if provided', function () {

      var Constructor = sinon.spy();
      var ExtendedClass = Topic.extend({
        'constructor': Constructor
      });

      new ExtendedClass();
      expect(Constructor).to.have.been.calledOnce;
    });

    it('should skip parent constructor when a custom constructor is used', function () {

      var ParentConstructor = sinon.spy();
      var Constructor = sinon.spy();
      var ExtendedClass = Topic.extend.call(ParentConstructor, {
        'constructor': Constructor
      });

      new ExtendedClass();
      expect(Constructor).to.have.been.calledOnce;
      expect(ParentConstructor).to.have.not.been.called;
    });
  });

  describe('class returned by #extend', function () {

    var ExtendedClass, ThirdClass;
    beforeEach(function () {

      ExtendedClass = Topic.extend({
        'foo': 'bar'
      }, {
        'baz': 'fooz'
      });

      ThirdClass = ExtendedClass.extend({
        'foo': 'moreBar'
      });
    });


    it('should have #extend class method', function () {
      expect(ExtendedClass.extend).to.be.a('function');
    });

    it('should point constructor on the prototype to the class', function () {
      expect(ExtendedClass.prototype.constructor).to.be.equal(ExtendedClass);
    });

    it('should point __super__ to the parent prototype', function () {
      expect(ThirdClass.__super__).to.be.equal(ExtendedClass.prototype);
    });

    it('should have static/class methods', function () {
      expect(ExtendedClass.baz).to.be.equal('fooz');
    });

    it('should have methods on the prototype', function () {
      expect(ExtendedClass.prototype.foo).to.be.equal('bar');
    });

    it('should be extendable itself', function () {
      expect(ThirdClass.prototype.foo).to.be.equal('moreBar');
      expect(ThirdClass.extend).to.be.a('function');
    });

    it('should inherit static methods from parent', function () {
      expect(ThirdClass.baz).to.be.equal('fooz');
    });
  });

  describe('class initialization', function () {

    var ExtendedClass;
    beforeEach(function () {
      ExtendedClass = Topic.extend();
    });


    it('should create unique instances', function () {
      expect(new ExtendedClass()).to.not.be.equal(new ExtendedClass());
    });

    it('should call initialize for new instances', function () {

      var InitSpy = sinon.spy(ExtendedClass.prototype, 'initialize');
      new ExtendedClass();
      expect(InitSpy).to.have.been.calledOnce;
      InitSpy.restore;
    });

    it('should assign a unique `uid` to the instances', function () {

      var i = 500, uids = [], instance;
      while (i--) {
        instance = new ExtendedClass();
        expect(instance.uid).to.be.not.undefined;
        expect(uids).to.not.include(instance.uid);
        uids.push(instance.uid);
      }
    });
  });

  describe('mixins', function () {

    var Mixin, spy;
    beforeEach(function (done) {
      requirejs([
        'WBMixin'
      ], function (WBMixin) {

        spy = sinon.spy();

        Mixin = WBMixin.extend({
          'initialize': spy,
          'foo': function () {}
        });

        done();
      })
    });

    it('should be auto-applied, if any', function () {

      var Klass = Topic.extend({
        'mixins': [
          Mixin
        ]
      });

      var instance = new Klass();
      expect(instance.foo).to.be.a('function');
      expect(instance.initialize).to.not.equal(spy);
      expect(spy).to.have.been.called;
    });

    it('should not do anything, if none', function () {

      var Klass = Topic.extend({
        'mixins': []
      });

      var instance = new Klass();
      expect(instance.foo).to.equal(undefined);
      expect(instance.initialize).to.not.equal(spy);
      expect(spy).to.not.have.been.called;
    });
  });

});
