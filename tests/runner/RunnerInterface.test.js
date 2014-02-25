test('runner/RunnerInterface', [

  '../../lib/runner/RunnerInterface',
  '../mocks/Server'

], function (runner) {

  var instance;

  runner.beforeEach(function () {
    instance = new runner.deps.RunnerInterface();
  });

  runner.spec('test (string name, array dependencies, function callback)', function () {

    runner.when('name is not a string', function () {

      runner.it('should throw an error', function () {

        expect(function () {
          instance.test(null, [], function () {});
        }).to.throw(Error);
      });
    });

    runner.when('callback is not a function', function () {

      runner.it('should throw an error', function () {

        expect(function () {
          instance.test('name', [], null);
        }).to.throw(Error);

        expect(function () {
          instance.test('name', null);
        }).to.throw(Error);
      });
    });
  });

  runner.spec('it (string message, function callback)', function () {

    runner.when('message is not a string', function () {

      runner.it('should throw an error', function () {

        expect(function () {
          instance.it(null, function () {});
        }).to.throw(Error);
      });
    });

    runner.when('callback is not a function', function () {

      runner.it('should NOT throw an error', function () {

        expect(function () {
          instance.it('null', null);
        }).to.not.throw(Error);
      });
    });

    runner.when('callback functions takes done() argument', function () {

      runner.when('done() is called', function () {

        it('should not timeout the test', function (done) {

          setTimeout(done, 10);
        });
      });
    });
  });

  runner.before(function () {

    this.server = runner.deps.Server.listen(5657);
  });

  runner.after(function () {

    this.server.close();
  });

  runner.integration('http://asimovjs.org', function () {

    runner.it('should return a 200 OK', function () {

      expect(this.browser.success).to.be.true;
    });
  });
});