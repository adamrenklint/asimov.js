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

  test.spec('config ()', function () {

    test.it('should expose the projects package.json as "PKG"', function () {
      expect(asimov.config('PKG').name).to.equal('asimov');
    });

    test.it('should expose the framework package.json as "ASIMOV"', function () {
      expect(asimov.config('ASIMOV').name).to.equal('asimov');
    });

    test.it('should expose process.cwd() as "ROOT"', function () {
      expect(asimov.config('ROOT')).to.equal(process.cwd());
    });

    test.it('should expose "FRAMEWORK_ROOT"', function () {
      expect(asimov.config('FRAMEWORK_ROOT')).to.equal(process.cwd());
    });

    test.when('a key and a value is passed', function () {

      test.it('should be chainable', function () {

        expect(asimov.config('something123', true)).to.equal(asimov);
      });
    });

    test.when('an object is passed', function () {

      test.it('should be chainable', function () {

        expect(asimov.config({
          'someVaran': true
        })).to.equal(asimov);
      });
    });
  });

  function testPublicInterface (name) {
    test.it('should expose "' + name + '" as a function in the public interface', function () {
      expect(asimov[name]).to.be.a('function');
    });
  }

  test.spec('publicInterface()', function () {

    [
      'config',
      'on',
      'off',
      'once',
      'trigger',
      'publish',
      'unpublish',
      'use',
      'start',
      'register',
      'config',
      'addSequence',
      'runSequence',
      'logPending',
      'logSince',
      'error',
      'paths',
      'init',
      'preinit',
      'postinit'
    ].forEach(testPublicInterface);
  });

  test.spec('start ()', function () {

    test.when('there are no registered initializers', function () {

      test.it('should trigger "app:started"', function () {

        var spy = sinon.spy();
        asimov.once('app:started', spy);
        asimov.start();

        expect(spy).to.have.been.calledOnce;
      });
    });

    test.when('there are registered initializers', function () {

      test.it('should start initializer sequence', function () {

        var spy = sinon.spy();
        asimov.init(function (next) {
          spy();
          next();
        });
        asimov.start();

        expect(spy).to.have.been.calledOnce;
      });

      test.it('should trigger "app:started"', function () {

        var spy = sinon.spy();
        asimov.init(function (next) {
          next();
        });

        asimov.once('app:started', spy);
        asimov.start();

        expect(spy).to.have.been.calledOnce;
      });
    });
  });
});
