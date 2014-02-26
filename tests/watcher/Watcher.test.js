test('watcher/Watcher', [

  '../../lib/watcher/Watcher',

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

    runner.when('path is a valid path', function () {

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
          var content = '7s89d7a9sd7';

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
          var content1 = '7s89d7a9sd7';
          var content2 = '7s89d77d98as9da9sd7';

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
});