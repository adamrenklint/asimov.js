var test = require('asimov-test');
var Asimov = require('../../lib/Asimov');

test('lib/Asimov', function (test) {

  var asimov, instance;

  beforeEach(function () {
    instance = new Asimov({
      'muteLog': true
    });
    asimov = instance.publicInterface();
  });

  afterEach(function () {
    instance.destroy();
  });

  test.spec('use (function plugin)', function () {

    test.when('plugin is not a function', function () {

      test.itShould.throwError(function () {
        asimov.use();
      });
    });

    test.when('plugin is a function', function () {

      test.it('should execute the function', function () {

        var spy = sinon.spy();
        asimov.use(spy);
        expect(spy).to.have.been.calledOnce;
      });

      test.it('should pass itself to the function', function (done) {

        asimov.use(function (a) {
          expect(a).to.equal(asimov);
          done();
        });
      });

      test.it('should be chainable', function () {

        var spy = sinon.spy();
        expect(asimov.use(spy)).to.equal(asimov);
      });
    });
  });

  function testSequence (method, name) {

    name = name || method;

    test.spec(method + ' (function ' + name + ')', function () {

      test.when(name + ' is not a function', function () {

        test.itShould.throwError(function () {
          asimov[method]();
        });
      });

      test.when(name + ' is a function', function () {

        test.it('should only execute the same ' + name + ' once', function () {

          var spy = sinon.spy();
          asimov[method](spy)[method](spy).runSequence(name);

          expect(spy).to.have.been.calledOnce;
        });

        test.it('should be chainable', function () {

          var spy = sinon.spy();
          expect(asimov[method](spy)).to.equal(asimov);
        });
      });
    });
  }

  // testSequence('init', 'initializer');
  // testSequence('processor');
  // testSequence('middleware');

  // test.spec('helper (string name, function helper)', function () {
  //
  //   test.when('name is not a string', function () {
  //
  //     test.itShould.throwError(function () {
  //       asimov.helper(null, function () {});
  //     });
  //   });
  //
  //   test.when('name is a string', function () {
  //
  //     test.when('helper is not a function', function () {
  //
  //       test.itShould.throwError(function () {
  //         asimov.helper('myHelper', null);
  //       });
  //     });
  //
  //     test.when('helper is a function', function () {
  //
  //       test.it('should save a reference to the helper', function () {
  //
  //         var spy = sinon.spy();
  //         asimov.helper('ssspy', spy);
  //         expect(instance.helpers.ssspy).to.equal(spy);
  //       });
  //
  //       test.it('be chainable', function () {
  //
  //         var spy = sinon.spy();
  //         expect(asimov.helper('spy', spy)).to.equal(asimov);
  //       });
  //     });
  //   });
  // });

  // test.spec('addSequence (string namespace, string method)');

  test.spec('runSequence (string namespace, function done)', function () {

    test.when('namespace is not valid', function () {

      test.itShould.throwError(function () {
        asimov.runSequence('beeswax');
      });
    });

    test.when('namespace is valid', function () {

      test.it('should execute the first job', function () {

        var spy = sinon.spy();
        asimov.init(spy);
        asimov.runSequence('initializer');

        expect(spy).to.have.been.calledOnce;
      });

      test.it('should pass a "next" iterator function', function (done) {

        asimov.init(function (next) {
          expect(next).to.be.a('function');
          done();
        });

        asimov.runSequence('initializer');
      });

      test.it('should pass the public interface', function (done) {

        asimov.init(function (next, public) {
          expect(public).to.equal(asimov);
          done();
        });

        asimov.runSequence('initializer');
      });

      test.when('the job executes the "next" iterator', function () {

        test.it('should execute the next job', function (done) {

          asimov.init(function (next) {
            next();
          });

          asimov.init(function (next) {
            done();
          });

          asimov.runSequence('initializer');
        });

        test.when('the last job calls the "next" iterator', function () {

          test.it('should call the "done" callback', function (done) {

            asimov.init(function (next) {
              next();
            });

            asimov.runSequence('initializer').done(function () {
              done();
            });
          });
        });
      });
    });
  });

  test.spec('register (string name, object target)', function () {

    test.when('name is not a string', function () {

      test.itShould.throwError(function () {
        asimov.register(null, {});
      });
    });

    test.when('name is a string', function () {

      test.when('target is not defined', function () {

        test.itShould.throwError(function () {
          asimov.register('public', null);
        });
      });

      test.when('target is defined', function () {

        test.it('should include target in the public interface', function () {

          var added = { 'foo': 'bar' };
          asimov.register('public', added);
          expect(asimov.public).to.equal(added);
        });
      });
    });
  });

  // test.spec('templates (string path)', function () {
  //
  //   test.when('no templates collection is registred', function () {
  //
  //     test.itShould.notThrowError(function () {
  //
  //     });
  //   });
  //
  //   test.when('a templates collection is registered', function () {
  //
  //       test.when('path does not exist', function () {
  //
  //         test.itShould.notThrowError();
  //       });
  //
  //       test.when('path exists', function () {
  //
  //         test.it('should add the templates in path to the collection');
  //       });
  //   });
  //
  //   test.it('should be chainable', function () {
  //
  //     expect(asimov.templates()).to.equal(asimov);
  //   });
  // });

  test.spec('start ()', function () {

    test.it('should start initializer sequence', function () {

      var spy = sinon.spy();
      asimov.init(spy);
      asimov.start();

      expect(spy).to.have.been.calledOnce;
    });
  });
});
