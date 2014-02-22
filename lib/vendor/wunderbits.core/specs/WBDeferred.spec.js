describe('WBDeferred', function () {

  'use strict';

  var defer, WBDeferred;

  beforeEach(function (done) {
    requirejs([
      'WBDeferred'
    ], function (klass) {

      WBDeferred = klass;
      defer = new WBDeferred();

      done();
    });
  });

  describe('instance', function () {
    it('should be an instance of WBDeferred', function () {
      defer.should.be.an.instanceof(WBDeferred);
    });
  });

  describe('Deferred state', function () {

    function createDeferred(fn) {
      return new WBDeferred(fn);
    }

    describe('should change it\'s state to', function () {
      it('"resolved" when the done function is called', function () {
        defer.resolve().then(function() {
          expect(defer.state()).to.be.equal('resolved');
        });
      });

      it('"rejected" when fail is called', function () {
        defer.reject().then(function() {
          expect(defer.state()).to.be.equal('rejected');
        });
      });
    });


    it('should pass the parameter from #resolve to the done callback', function () {

      defer.resolve('done');

      defer.done(function(value) {
        expect(value).to.equal('done');
      }, this);
    });

    it('should create a promise object & it\'s methods', function () {

      createDeferred(function(defer) {

        var promise = defer.promise();
        var func = function() {};
        var funcPromise = defer.promise(func);
        expect(Object.keys(defer.promise())).to.deep.equal(Object.keys(promise));
        expect(funcPromise).to.equal(func);

        for (var key in promise) {

          if (typeof promise[key] === 'function') {
            expect(false).to.not.be.ok;
          }

          if (promise[key] !== func[key]) {
            expect(func[key]).to.equal(promise[key]);
          }
        }
      });
    });
  });

  describe('should be chainable', function () {

    var apiVerbs = [
      'resolve',
      'reject',
      'resolveWith',
      'rejectWith',
      'done',
      'fail',
      'always',
      'then'
    ];

    apiVerbs.forEach(function (name) {
      it('for #' + name, function () {

        var method = defer[name];
        expect(method).to.be.a('function', name);
        var self = method.call(defer);
        expect(self).to.equal(defer);
      });
    });

    it('not for #promise', function () {
      var self = defer.promise();
      expect(self).to.not.equal(defer);
    });
  });

  describe('#then', function () {

    var context;
    beforeEach(function () {
      context = {'a':'b'};
    });

    describe('should be called if the deferred is', function () {

      var spy;
      beforeEach(function () {
        spy = sinon.spy();
        defer.then(spy);
      });

      function check (done) {
        setTimeout(function () {
          expect(spy).to.have.been.called;
          done();
        });
      }

      it('resolved', function (done) {
        defer.resolve();
        check(done);
      });

      it('rejected', function (done) {
        defer.reject();
        check(done);
      });
    });

    it('should call the #then callback with the correct context', function (done) {

      var overriddenContext = {'a': 'b'};
      var promise = defer.resolveWith(context, [2]);
      promise.done(function(value) {
        expect(this).to.deep.equal(overriddenContext);
        expect(value).to.deep.equal([2]);
        done();
      }, overriddenContext);
    });

    it('should use the resolveWith context if there is no overridden context', function (done) {

      defer.done(function(value) {
        expect(this).to.deep.equal(context);
        expect(value).to.deep.equal([2]);
      });

      defer.resolveWith(context, [2]);
      done();
    });

    describe('should resolve or reject the expected values and call done in correct order', function () {

      var fn1, fn2, fn3;
      beforeEach(function () {

        fn1 = sinon.spy();
        fn2 = sinon.spy();
        fn3 = sinon.spy();

        defer.promise().then(fn1).done(fn2).fail(fn3);
      });

      it('reject', function () {

        defer.reject();

        expect(fn1).to.have.been.called;
        expect(fn2).to.not.have.been.called;
        expect(fn3).to.have.been.called;
        expect(fn3).to.have.been.calledAfter(fn1);
      });

      it('resolve', function () {

        defer.resolve();

        expect(fn1).to.have.been.called;
        expect(fn2).to.have.been.called;
        expect(fn3).to.not.have.been.called;
        expect(fn2).to.have.been.calledAfter(fn1);
      });
    });
  });

  describe('#trigger', function () {

    it('should be called only once, if pending', function () {

      var spy = sinon.spy(defer, 'trigger');
      defer.resolve();
      expect(spy).to.have.been.called;
      spy.restore();
    });

    it('should not be called, if resolved/rejected already', function () {

      defer.reject();
      var spy = sinon.spy(defer, 'trigger');
      defer.resolve();
      expect(spy).to.not.have.been.called;
      spy.restore();
    });
  });
});