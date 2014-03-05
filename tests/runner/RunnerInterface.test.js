test('runner/RunnerInterface', [

  '../../lib/runner/RunnerInterface'


], function (test) {

  var instance;

  test.beforeEach(function () {
    instance = new test.deps.RunnerInterface();
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

  // test.before(function () {

  //   this.server = test.deps.Server.listen(5657);
  // });

  // test.after(function () {

  //   this.server.close();
  // });

  // test.integration('/', function () {

  //   test.itShouldLoad();
  //   // test.it('should return a 200 OK', function () {

  //   //   expect(this.browser.success).to.be.true;
  //   // });
  // });

  // test.integration('http://asimovjs.org', function () {

  //   test.itShouldLoad();
  //   // test.it('should return a 200 OK', function () {

  //   //   expect(this.browser.success).to.be.true;
  //   // });
  // });
});