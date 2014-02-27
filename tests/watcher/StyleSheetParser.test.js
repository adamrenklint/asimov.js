test('watcher/StyleSheetParser', [

  '../../lib/watcher/StyleSheetParser',
  '../../lib/core/Model',
  'lodash'

], function (runner) {

  var instance, _;

  runner.beforeEach(function () {
    instance = new runner.deps.StyleSheetParser();
    _ = runner.deps.lodash;
  });

  runner.afterEach(function () {
    instance.destroy();
  });

  runner.spec('parse (object model, string raw, object dependencies)', function () {

    runner.when('model is not a valid model', function () {

      runner.it('should throw an error', function () {

        var dependencies = new runner.deps.Model();
        expect(function () {
          instance.parse(null, 'foo', dependencies);
        }).to.throw(Error);
      });
    });

    runner.when('model is not a model, but without attributes.path', function () {

      runner.it('should throw an error', function () {

        var model = new runner.deps.Model();
        var dependencies = new runner.deps.Model();
        expect(function () {
          instance.parse(model, 'foo', dependencies);
        }).to.throw(Error);
      });
    });

    runner.when('raw does not contain an @import statement', function () {

      runner.it('should only add itself to the dependency graph', function (done) {

        var model = new runner.deps.Model({
          'path': 'foo/bar'
        });
        var dependencies = new runner.deps.Model();
        instance.parse(model, 'foo', dependencies);

        _.each(dependencies.attributes, function (arr, path) {
          if (path.indexOf('foo/bar') >= 0) {
            _.each(arr, function (dep) {
              if (dep.attributes.path.indexOf('foo/bar') >= 0) {
                done();
              }
            });
          }
        });
      });
    });

    runner.when('raw contains @import statements', function () {

      runner.when('the imported stylus file exists', function () {

        runner.it('should register the model as a node of the stylus file in the dependency graph');
      });

      runner.when('the imported stylus file does not exist', function () {

        runner.it('should throw error');
      });
    });

    runner.when('raw is not a string',  function () {

      runner.it('should use model.attributes.raw as raw');
    });
  });
});