var test = require('asimov-test');
var Asimov = require('../../lib/Asimov');

test('lib/Asimov', function (test) {

  var instance;

  beforeEach(function () {
    instance = new Asimov({
      'muteLog': true
    });
  });

  afterEach(function () {
    instance.destroy();
  });

  test.spec('use (function plugin)', function () {

    test.when('plugin is not a function', function () {

      test.itShould.throwError(function () {
        instance.use();
      });
    });

    test.when('plugin is a function', function () {

      test.it('should execute the function', function () {

        var spy = sinon.spy();
        instance.use(spy);
        expect(spy).to.have.been.calledOnce;
      });

      test.it('should pass itself to the function', function (done) {

        instance.use(function (a) {
          expect(a).to.equal(instance);
          done();
        });
      });
    });
  });

  // test.spec('start ()', function () {
  //
  //   test.it('should execute all initializers', function () {
  //
  //
  //   });
  // });
});
