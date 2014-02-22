describe('WBDeferred', function () {

  'use strict';

  var WBDeferred;

  beforeEach(function (done) {
    requirejs([
      'wunderbits/WBDeferred'
    ], function (deferred) {

      WBDeferred = deferred;

      done();
    });
  });

  describe('Deferred state', function () {

    var defer;
    beforeEach(function () {
      defer = new WBDeferred();
    });

    function createDeferred(fn) {

      return new WBDeferred(fn);
    }

    it('should be an instance of WBDeferred', function () {
      defer.should.be.an.instanceof(WBDeferred);
    });

    it('should change it\'s state to "resolved" when the done function is called', function () {

      var spy1 = sinon.spy();
      var spy2 = sinon.spy();

      defer.resolve().done(function() {
        expect(this.state()).to.be.equal('resolved');
      }).fail(spy1).always(spy2);

      spy1.should.not.have.been.called;
      spy2.should.have.been.called;
    });

    it('should change it\'s state to "rejected" when fail is called', function () {

      var spy1 = sinon.spy();
      var spy2 = sinon.spy();

      defer.reject().done(function() {
        spy1();
      }).fail(function() {
        spy2();
        expect(this.state()).to.be.equal('rejected');
      });

      spy1.should.not.have.been.called;
      spy2.should.have.been.called;
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

  describe('chaining methods', function () {

    it('should be chainable', function () {

      var defer = new WBDeferred();
      var apiVerbs = ['resolve', 'reject', 'notify', 'resolveWith', 'rejectWith', 'notifyWith', 'done', 'fail', 'progress', 'always'];
      var method;

      for(var i=0;i<apiVerbs.length;i++) {
        method = apiVerbs[i];
        var object = {
          'm': defer[method]
        };
        expect(object.m).to.equal(defer[method]);
      }
    });
  });

  describe('#then', function () {

    var defer,context;
    beforeEach(function () {
      defer = new WBDeferred();
      context = {'a':'b'};
    });

    it('should call then if the deferred is resolved or rejected', function () {

      var value1, value2, value3;
      var spy = sinon.spy();

      defer.then(function(a, b) {
        value3 = a * b;
      }, this);

      defer.done(function(a, b) {
        value1 = a;
        value2 = b;
      }, this);

      defer.resolve(2, 3);
      expect(value1).to.equal(2);
      expect(value2).to.equal(3);
      expect(value3).to.equal(6);

      defer.reject(function() {
        spy();
      }, this);

      // defer.resolve().then(function () {}).done(function(value) {
      //   expect(value).to.equal(undefined);
      // }, this);

      spy.should.not.have.been.called;
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
});