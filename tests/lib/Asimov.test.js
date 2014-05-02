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
          asimov[method](spy)[method](spy).sequence(name);

          expect(spy).to.have.been.calledOnce;
        });

        test.it('should be chainable', function () {

          var spy = sinon.spy();
          expect(asimov[method](spy)).to.equal(asimov);
        });
      });
    });
  }

  testSequence('init', 'initializer');
  testSequence('processor');
  testSequence('middleware');

  test.spec('helper (string name, function helper)', function () {

    test.when('name is not a string', function () {

      test.itShould.throwError(function () {
        asimov.helper(null, function () {});
      });
    });

    test.when('name is a string', function () {

      test.when('helper is not a function', function () {

        test.itShould.throwError(function () {
          asimov.helper('myHelper', null);
        });
      });

      test.when('helper is a function', function () {

        // it should register helper

        test.it('be chainable', function () {

          var spy = sinon.spy();
          expect(asimov.helper('spy', spy)).to.equal(asimov);
        });
      });
    });
  });

  test.spec('sequence (string namespace, function done)', function () {

    test.when('namespace is not valid', function () {

      test.itShould.throwError(function () {
        asimov.sequence('beeswax');
      });
    });

    test.when('namespace is valid', function () {

      test.it('should execute the first job', function () {

        var spy = sinon.spy();
        asimov.init(spy);
        asimov.sequence('initializer');

        expect(spy).to.have.been.calledOnce;
      });

      test.it('should pass a "next" iterator function', function (done) {

        asimov.init(function (next) {
          expect(next).to.be.a('function');
          done();
        });

        asimov.sequence('initializer');
      });

      test.when('the job executes the "next" iterator', function () {

        test.it('should execute the next job', function (done) {

          asimov.init(function (next) {
            next();
          });

          asimov.init(function (next) {
            done();
          });

          asimov.sequence('initializer');
        });

        test.when('the last job calls the "next" iterator', function () {

          test.it('should call the "done" callback', function (done) {

            asimov.init(function (next) {
              next();
            });

            asimov.sequence('initializer', function () {
              done();
            });
          });
        });
      });
    });
  });

  test.spec('start ()', function () {

    test.it('should start initializer sequence', function () {

      var spy = sinon.spy();
      asimov.init(spy);
      asimov.start();

      expect(spy).to.have.been.calledOnce;
    });
  });
});
