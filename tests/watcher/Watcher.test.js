test('watcher/Watcher', [

  '../../lib/watcher/Watcher',
  '../../lib/core/Model'

], function (runner) {

  var instance;

  runner.beforeEach(function () {
    instance = new runner.deps.Watcher();
  });

  runner.afterEach(function () {
    instance.destroy();
  });

  runner.spec('startWatching (string path)', function () {

    runner.when('path is NOT a string', function () {

      runner.it('should throw an error', function () {

        expect(function () {

          instance.startWatching(null);
        }).to.throw(Error);
      });
    });

    runner.when('path is a string', function () {

      runner.when('a file in the path is added', function () {

        runner.it('should call self.handleChange', function (done) {

          var filename = runner.getTempFilename();
          var content = '7s89d7a9sd7';

          instance.handleChange = function (changed) {
            if (changed.indexOf(filename) >= 0) {
              done();
            }
          };

          instance.startWatching(runner.options.tempPath);
          runner.writeTempFile(filename, content);
        });
      });

      runner.when('a file in the path is removed', function () {

        runner.it('should call self.handleChange', function (done) {

          var filename = runner.getTempFilename();
          var content = 'foo';

          instance.handleChange = function (changed) {
            if (changed.indexOf(filename) >= 0) {
              done();
            }
          };

          runner.writeTempFile(filename, content);
          instance.startWatching(runner.options.tempPath);
          runner.removeTempFile(filename);
        });
      });

      runner.when('a file in the path is changed', function () {

        runner.it('should call self.handleChange', function () {

          var filename = runner.getTempFilename();
          var content1 = 'foo';
          var content2 = 'barbaz';

          instance.handleChange = function (changed) {
            if (changed.indexOf(filename) >= 0) {
              done();
            }
          };

          runner.writeTempFile(filename, content1);
          instance.startWatching(runner.options.tempPath);
          runner.writeTempFile(filename, content2);
        });
      });
    });
  });

  runner.spec('watch (object model)', function () {

    runner.when('model.attributes.type is not defined', function () {

      runner.it('should throw an error', function () {

        var model = new runner.deps.Model({
          'path': 'foo',
          'raw': 'bar'
        });

        expect(function () {
          instance.watch(model);
        }).to.throw(Error);
      });
    });

    runner.when('model.attributes.path is not defined', function () {

      runner.it('should throw an error', function () {

        var model = new runner.deps.Model({
          'type': 'foo',
          'raw': 'bar'
        });

        expect(function () {
          instance.watch(model);
        }).to.throw(Error);
      });
    });

    runner.when('model.attributes.raw is not defined', function () {

      runner.it('should throw an error', function () {

        var model = new runner.deps.Model({
          'path': 'foo',
          'type': 'bar'
        });

        expect(function () {
          instance.watch(model);
        }).to.throw(Error);
      });
    });
  });

  runner.spec('parseDependencies (object model)', function () {

    runner.when('there is no matching parser for model.attributes.type', function () {

      runner.it('should throw an error', function () {

        var model = new runner.deps.Model({
          'path': 'foo',
          'type': 'bar',
          'raw': 'baz'
        });

        expect(function () {
          instance.parseDependencies(model);
        }).to.throw(Error);
      });
    });

    runner.when('there is a matching parser for model.attributes.type', function () {

      //
    });
  });
});