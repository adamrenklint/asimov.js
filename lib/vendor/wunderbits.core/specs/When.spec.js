describe('When', function () {

  'use strict';

  var WBWhen, WBDeferred;

  beforeEach(function (done) {
    requirejs([
      'When',
      'WBDeferred'
    ], function (When, deferred) {

      WBWhen = When;
      WBDeferred = deferred;
      done();
    });
  });

  describe('#when', function () {

    var when;
    beforeEach(function () {

      when = WBWhen.when;

    });

    it('should chain deferred methods', function (done) {

      var deferred1 = new WBDeferred();
      var deferred2 = new WBDeferred();
      var spy = sinon.spy();

      when(deferred1, deferred2).done(spy);

      deferred1.resolve();
      deferred2.resolve();

      spy.should.have.been.called.once;
      done();
    });

    it('should create a promise when no parameter is passed', function (done) {

      var context = {};
      when().done(function(resolveValue) {
        expect(this).to.equal(context);
        expect(resolveValue).to.equal(undefined);
      }, context).promise();

      done();
    });

    it('should pass the context when resolveWith is called', function (done) {

      var context = {};
      var deferred = new WBDeferred();

      when(deferred).done(function(value) {

        expect(this).to.equal(context);
        expect(value).to.deep.equal([2]);
      });

      deferred.resolveWith(context, 2);
      done();
    });

    it('should resolve with the correct context if it is overwritten', function (done) {

      var context = {};
      var overriddenContext = {'a': 'b'};
      var deferred = new WBDeferred();

      when(deferred).done(function(value) {

        expect(this).to.equal(overriddenContext);
        expect(value).to.deep.equal([2]);
      }, overriddenContext);

      deferred.resolveWith(context, 2);
      done();
    });

    it('should call #then when the deferred is resolved or rejected', function (done) {

      var deferred = new WBDeferred();
      var thenSpy = sinon.spy();
      var doneSpy = sinon.spy();
      var failSpy = sinon.spy();

      when(deferred).then(thenSpy).done(doneSpy).fail(failSpy);

      deferred.resolve();

      thenSpy.should.have.been.called.once;
      doneSpy.should.have.been.called.once;
      failSpy.should.not.have.been.called;

      done();
    });

    it('should call #done when the deferred is resolved', function (done) {

      var deferred = new WBDeferred();
      var doneSpy = sinon.spy();
      var failSpy = sinon.spy();

      when(deferred).done(doneSpy).fail(failSpy);

      deferred.resolve();

      doneSpy.should.have.been.called.once;
      failSpy.should.not.have.been.called;

      done();
    });

    it('should call #fail when the deferred is rejected', function (done) {

      var deferred = new WBDeferred();
      var thenSpy = sinon.spy();
      var doneSpy = sinon.spy();
      var failSpy = sinon.spy();

      when(deferred).then(thenSpy).done(doneSpy).fail(failSpy);
      deferred.reject();
      thenSpy.should.have.been.called.once;
      failSpy.should.have.been.called.once;
      doneSpy.should.not.have.been.called;

      done();
    });

    it('should allow more than 1 when function', function (done) {

      var deferred1 = new WBDeferred();
      var deferred2 = new WBDeferred();
      var deferred3 = new WBDeferred();
      var thenSpy = sinon.spy();
      var doneSpy = sinon.spy();
      var failSpy = sinon.spy();

      var thenSpy2 = sinon.spy();
      var doneSpy2 = sinon.spy();
      var failSpy2 = sinon.spy();

      when(deferred1).then(thenSpy).done(doneSpy).fail(failSpy);
      when(deferred2, deferred3).then(thenSpy2).done(doneSpy2).fail(failSpy2);

      deferred1.resolve();

      thenSpy.should.have.been.called;
      doneSpy.should.have.been.called;

      deferred2.resolve();
      deferred3.resolve();
      thenSpy2.should.have.been.called;
      doneSpy2.should.have.been.called;

      done();
    });

    it('should only fire a callback when all the arguments have been completed', function (done) {

      var deferred = new WBDeferred();
      var deferred2 = new WBDeferred();
      var thenSpy = sinon.spy();
      var doneSpy = sinon.spy();
      var failSpy = sinon.spy();

      when(deferred, deferred2).then(thenSpy).done(doneSpy).fail(failSpy);

      deferred.reject();

      thenSpy.should.have.been.called;
      failSpy.should.have.been.called;
      doneSpy.should.not.have.been.called;

      done();
    });

    it('should ensure correct order of returned values on multiple deferreds', function (done) {

      var deferred1 = new WBDeferred();
      var deferred2 = new WBDeferred();
      var deferred3 = new WBDeferred();

      when(deferred1, deferred2, deferred3).then(function (a, b, c) {

        expect(a).to.deep.equal([2, 3]);
        expect(b).to.deep.equal(['a', 'b']);
        expect(c).to.deep.equal([true, null, false]);
        done();
      });

      deferred3.resolve(true, null, false);
      deferred1.resolve(2, 3);
      deferred2.resolve('a', 'b');
    });

    it('should return an array of parameters when the deferred is resolved with multiple items', function (done) {

      var deferred = new WBDeferred();

      when(deferred).done(function (param) {

        expect(param).to.be.instanceof(Array);
        done();
      });

      deferred.resolve(1, 2, 3);
    });

    it('should return an array when the deferred is resolved with one item', function (done) {

      var deferred = new WBDeferred();

      when(deferred).done(function (param) {

        expect(param).to.be.instanceof(Array);
        done();
      });

      deferred.resolve(1);
    });
  });
});