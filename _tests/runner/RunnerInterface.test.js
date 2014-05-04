var libPath = '../../lib/';
var RunnerInterface = require(libPath + 'runner/RunnerInterface');
var Test = require(libPath + 'runner/Test');

Test.run('runner/RunnerInterface', function (test) {

  var instance;

  test.beforeEach(function () {
    instance = new RunnerInterface();
  });

  test.spec('test (string name, array dependencies, function callback)', function () {

    test.when('name is not a string', function () {

      test.it('should throw an error', function () {

        expect(function () {
          instance.test(null, [], function () {});
        }).to.throw(Error);
      });
    });

    test.when('callback is not a function', function () {

      test.it('should throw an error', function () {

        expect(function () {
          instance.test('name', [], null);
        }).to.throw(Error);

        expect(function () {
          instance.test('name', null);
        }).to.throw(Error);
      });
    });
  });

  test.spec('it (string message, function callback)', function () {

    test.when('message is not a string', function () {

      test.it('should throw an error', function () {

        expect(function () {
          instance.it(null, function () {});
        }).to.throw(Error);
      });
    });

    test.when('callback is not a function', function () {

      test.it('should NOT throw an error', function () {

        expect(function () {
          instance.it('null', null);
        }).to.not.throw(Error);
      });
    });

    test.when('callback functions takes done() argument', function () {

      test.when('done() is called', function () {

        it('should not timeout the test', function (done) {

          setTimeout(done, 10);
        });
      });
    });
  });

  test.integration('/', function () {

    test.itShould.loadPage();
  });
});