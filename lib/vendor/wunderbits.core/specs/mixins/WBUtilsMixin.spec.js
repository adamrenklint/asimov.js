describe('WBDeferrableMixin', function () {

  'use strict';

  var instance, context;

  beforeEach(function (done) {
    requirejs([
      'mixins/WBUtilsMixin'
    ], function (WBDeferrableMixin) {

      instance = {
        'id': 'instanceId'
      };

      context = {
        'id': 'providedContext'
      };

      WBDeferrableMixin.applyTo(instance);

      done();
    });
  });

  describe('#deferred', function () {

    it('should return a deferred', function () {
      var deferred = instance.deferred();
      deferred.state().should.be.equal('pending');
      deferred.resolve();
      deferred.state().should.be.equal('resolved');
    });

    describe('.done', function () {

      describe('given that a context is passed', function () {

        it('should execute the callback with provided context as this', function (done) {

          var deferred = instance.deferred();
          deferred.done(function () {

            expect(this.id).to.equal('providedContext');
            done();
          }, context);

          deferred.resolve();
        });
      });

      describe('given that no context is passed', function () {

        it('should execute the callback with provided context as this', function (done) {

          var deferred = instance.deferred();
          deferred.done(function () {

            expect(this.id).to.equal('instanceId');
            done();
          });

          deferred.resolve();
        });
      });
    });

    describe('.fail', function () {

      describe('given that a context is passed', function () {

        it('should execute the callback with provided context as this', function (done) {

          var deferred = instance.deferred();
          deferred.fail(function () {

            expect(this.id).to.equal('providedContext');
            done();
          }, context);

          deferred.reject();
        });
      });

      describe('given that no context is passed', function () {

        it('should execute the callback with provided context as this', function (done) {

          var deferred = instance.deferred();
          deferred.fail(function () {

            expect(this.id).to.equal('instanceId');
            done();
          });

          deferred.reject();
        });
      });
    });
  });

  describe('#when', function () {

    it('should proxy $.when', function () {

      var deferred1 = instance.deferred();
      var deferred2 = instance.deferred();
      var deferred3 = instance.deferred().reject();
      // var deferred4 = instance.deferred().resolve();
      // var deferred5 = instance.deferred().resolve();

      instance.when(deferred1, deferred2).state().should.be.equal('pending');
      instance.when(deferred2, deferred3).state().should.be.equal('rejected');
      // instance.when(deferred3, deferred4).state().should.be.equal('rejected');
      // instance.when(deferred1, deferred5).state().should.be.equal('pending');
      // instance.when(deferred4, deferred5).state().should.be.equal('resolved');
    });
  });

  describe('#defer', function () {

    describe('given that no context is passed', function () {

      it('should execute the callback with self as this', function (done) {

        var callback = function () {
          expect(this.id).to.equal('instanceId');
          done();
        };

        instance.defer(callback);
      });
    });

    describe('given that a context is passed', function () {

      it('should execute the callback with the provided context as this', function (done) {

        var callback = function () {

          expect(this.id).to.equal('providedContext');
          done();
        };

        instance.defer(callback, context);
      });
    });
  });

  describe('#delay', function () {
    it('should execute the function after the said delay');
    it('should resolve a function name string to the function on self');
    it('should default to self for context, if no context is passed');
  });

  describe('#defer', function () {
    it('should execute the function in the next event loop');
    it('should resolve a function name string to the function on self');
    it('should default to self for context, if no context is passed');
  });
});
