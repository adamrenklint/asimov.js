test('watcher/Watcher', [

  '../../lib/watcher/Watcher',
  '../../lib/core/Model'

], function (test) {

  var instance;

  test.beforeEach(function () {
    instance = new test.deps.Watcher(null, {
      'paths': {
        'styles': ['tests/mocks/styles']
      }
    });
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('startWatching (string path)', function () {

    test.when('path is NOT a string', function () {

      test.it('should throw an error', function () {

        expect(function () {

          instance.startWatching(null);
        }).to.throw(Error);
      });
    });

    test.when('path is a string', function () {

      test.when('a file in the path is added', function () {

        test.it('should call self.handleChange', function (done) {

          var filename = test.getTempFilename();
          var content = '7s89d7a9sd7';

          instance.handleChange = function (changed) {
            if (changed.indexOf(filename) >= 0) {
              done();
            }
          };

          instance.startWatching(test.options.tempPath);
          test.writeTempFile(filename, content);
        });
      });

      test.when('a file in the path is removed', function () {

        test.it('should call self.handleChange', function (done) {

          var filename = test.getTempFilename();
          var content = 'foo';

          instance.handleChange = function (changed) {
            if (changed.indexOf(filename) >= 0) {
              done();
            }
          };

          test.writeTempFile(filename, content);
          instance.startWatching(test.options.tempPath);
          test.removeTempFile(filename);
        });
      });

      test.when('a file in the path is changed', function () {

        test.it('should call self.handleChange', function () {

          var filename = test.getTempFilename();
          var content1 = 'foo';
          var content2 = 'barbaz';

          instance.handleChange = function (changed) {
            if (changed.indexOf(filename) >= 0) {
              done();
            }
          };

          test.writeTempFile(filename, content1);
          instance.startWatching(test.options.tempPath);
          test.writeTempFile(filename, content2);
        });
      });
    });
  });

  test.spec('watch (object model)', function () {

    test.when('model.attributes.type is not defined', function () {

      test.it('should throw an error', function () {

        var model = new test.deps.Model({
          'path': 'foo',
          'raw': 'bar'
        });

        expect(function () {
          instance.watch(model);
        }).to.throw(Error);
      });
    });

    test.when('model.attributes.path is not defined', function () {

      test.it('should throw an error', function () {

        var model = new test.deps.Model({
          'type': 'foo',
          'raw': 'bar'
        });

        expect(function () {
          instance.watch(model);
        }).to.throw(Error);
      });
    });

    test.when('model.attributes.raw is not defined', function () {

      test.it('should throw an error', function () {

        var model = new test.deps.Model({
          'path': 'foo',
          'type': 'bar'
        });

        expect(function () {
          instance.watch(model);
        }).to.throw(Error);
      });
    });

    test.when('a page file is added', function () {
      test.it('should trigger fetch on self.options.pages');
    });

    test.when('a page file is changed', function () {
      test.it('should trigger fetch on all its dependencies');
    });

    test.when('a page file is removed', function () {
      test.it('should trigger fetch on all its dependencies');
    });

    test.when('a data textile is added', function () {
      test.it('should trigger fetch on self.options.pages');
    });

    test.when('a data textile is changed', function () {
      test.it('should trigger fetch on all its dependencies');
    });

    test.when('a data textile is removed', function () {
      test.it('should trigger fetch on all its dependencies');
    });

    test.when('a template file is changed', function () {
      test.it('should trigger fetch on all its dependencies');
    });

    test.when('a template file is removed', function () {
      test.it('should trigger fetch on all its dependencies');
    });

    test.when('a stylesheet file is changed', function () {
      test.it('should trigger fetch on all its dependencies');
    });

    test.when('a stylesheet file is removed', function () {
      test.it('should trigger fetch on all its dependencies');
    });

    test.when('a javascript file is changed', function () {
      test.it('should trigger fetch on all its dependencies');
    });

    test.when('a javascript file is removed', function () {
      test.it('should trigger fetch on all its dependencies');
    });

    test.when('a config file is changed', function () {
      test.it('should call process.exit with code 1');
      // test.it('should throw an error');
    });

    test.when('a config file is removed', function () {
      test.when('that config file is loaded', function () {
        test.it('should call process.exit with code 1');
        // test.it('should throw an error');
      });
    });
  });

  test.spec('parseDependencies (object model)', function () {

    test.when('there is no matching parser for model.attributes.type', function () {

      test.it('should throw an error', function () {

        var model = new test.deps.Model({
          'path': 'foo',
          'type': 'bar',
          'raw': 'baz'
        });

        expect(function () {
          instance.parseDependencies(model);
        }).to.throw(Error);
      });
    });

    test.when('there is a matching parser for model.attributes.type', function () {

      test.it('should pass model as first argument', function () {

        var model = new test.deps.Model({
          'path': 'foo',
          'type': 'styleSheet',
          'raw': 'baz'
        });

        var spy = sinon.spy(instance._parsers.styleSheet, 'parse');

        instance.parseDependencies(model);
        expect(spy).to.have.been.calledWith(model);
        instance._parsers.styleSheet.parse.restore();
      });

      test.it('should pass itself as third argument', function () {

        var model = new test.deps.Model({
          'path': 'foo',
          'type': 'styleSheet',
          'raw': 'baz'
        });

        var spy = sinon.spy(instance._parsers.styleSheet, 'parse');

        instance.parseDependencies(model);
        expect(spy).to.have.been.calledWith(model, null, instance);
        instance._parsers.styleSheet.parse.restore();
      });
    });
  });
});