test('watcher/StyleSheetParser', [

  '../../lib/watcher/StyleSheetParser',
  '../../lib/core/Model',
  'lodash'

], function (runner) {

  var instance, _;

  runner.beforeEach(function () {
    instance = new runner.deps.StyleSheetParser({
      'paths': {
        'styles': ['lib/styles', 'site/styles']
      }
    });
    _ = runner.deps.lodash;
  });

  runner.afterEach(function () {
    instance.destroy();
  });

  runner.spec('initialize (object options)', function () {

    runner.when('options.paths.styles is not an array', function () {

      runner.it('should throw an error', function () {

        expect(function () {
          new runner.deps.StyleSheetParser();
        }).to.throw(Error);
      });
    });
  });

  runner.spec('parse (object model, string raw, object dependencies)', function () {

    runner.when('model is not a model', function () {

      runner.it('should throw an error', function () {

        var dependencies = new runner.deps.Model();
        expect(function () {
          instance.parse(null, 'foo', dependencies);
        }).to.throw(Error);
      });
    });

    runner.when('model is a model, but without attributes.path', function () {

      runner.it('should throw an error', function () {

        var model = new runner.deps.Model();
        var dependencies = new runner.deps.Model();
        expect(function () {
          instance.parse(model, 'foo', dependencies);
        }).to.throw(Error);
      });
    });

    runner.when('raw does not contain an @import statement', function () {

      runner.it('should only add itself to the dependency graph', function () {

        var model = new runner.deps.Model({
          'path': 'foo/bar'
        });
        var dependencies = new runner.deps.Model();
        instance.parse(model, 'foo', dependencies);

        expect(_.keys(dependencies.attributes).length).to.equal(1);

        _.each(dependencies.attributes, function (arr, path) {
          if (path.indexOf('foo/bar') >= 0) {
            expect(arr.length).to.equal(1);
            expect(arr[0].attributes.path).to.include('foo/bar');
          }
        });
      });
    });

    runner.when('raw contains @import statements', function () {

      runner.when('the imported stylus file exists', function () {

        runner.it('should add itself to the dependency graph', function () {

          var model = new runner.deps.Model({
            'path': 'foo/bar',
            'raw': '@import "404.styl"\n@import "main.styl"'
          });
          var dependencies = new runner.deps.Model();
          instance.parse(model, null, dependencies);

          expect(_.keys(dependencies.attributes).length).to.equal(3);

          _.each(dependencies.attributes, function (arr, path) {
            if (path.indexOf('foo/bar') >= 0) {

              expect(arr.length).to.equal(1);
              expect(arr[0].attributes.path).to.include('foo/bar');
            }
          });
        });

        runner.it('should register the model as a node of the stylus file in the dependency graph');

        runner.when('the found stylus file includes includes @import statements', function () {

          runner.it('should register the first stylesheet as a dependency of the other');
        });
      });

      runner.when('the imported stylus file does not exist', function () {

        runner.it('should throw error', function () {
          var model = new runner.deps.Model({
            'path': 'foo/bar'
          });
          var dependencies = new runner.deps.Model();
          expect(function () {
            instance.parse(model, '@import "notExisting.styl"', dependencies);
          }).to.throw(Error);
        });
      });
    });

    runner.when('raw is not a string',  function () {

      runner.it('should use model.attributes.raw as raw');
    });
  });
});