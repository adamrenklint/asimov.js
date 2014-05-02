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

  test.spec('init (function initializer)', function () {

    test.when('initializer is not a function', function () {

      test.itShould.throwError(function () {
        asimov.init();
      });
    });

    test.when('initializer is a function', function () {

      test.it('should only add the same initializer once', function () {

        var spy = sinon.spy();
        asimov.init(spy).init(spy).sequence('initializer');        

        expect(spy).to.have.been.calledOnce;
      });

      test.it('should be chainable', function () {

        var spy = sinon.spy();
        expect(asimov.init(spy)).to.equal(asimov);
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
