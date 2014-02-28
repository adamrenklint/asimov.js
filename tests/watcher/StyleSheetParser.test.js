test('watcher/StyleSheetParser', [

  '../../lib/watcher/StyleSheetParser',
  '../../lib/core/Model',
  'lodash'

], function (test) {

  var instance, _;

  test.beforeEach(function () {
    instance = new test.deps.StyleSheetParser({
      'paths': {
        'styles': ['tests/mocks/styles']
      }
    });
    _ = test.deps.lodash;
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('initialize (object options)', function () {

    test.when('options.paths.styles is not an array', function () {

      test.it('should throw an error', function () {

        expect(function () {
          new test.deps.StyleSheetParser();
        }).to.throw(Error);
      });
    });
  });

  test.spec('parse (object model, string raw, object dependencies)', function () {

    test.when('raw does not contain an @import statement', function () {

      test.it('should only add itself to the dependency graph', function () {

        var model = new test.deps.Model({
          'path': 'foo/bar'
        });
        var dependencies = new test.deps.Model();
        instance.parse(model, 'foo', dependencies);

        expect(_.keys(dependencies.attributes).length).to.equal(1);

        var wasFound = false;
        _.each(dependencies.attributes, function (arr, path) {
          if (path.indexOf('foo/bar') >= 0) {
            wasFound = true;
            expect(arr.length).to.equal(1);
            expect(arr[0].attributes.path).to.include('foo/bar');
          }
        });

        expect(wasFound).to.be.true;
      });
    });

    test.when('raw contains @import statements', function () {

      test.when('the imported stylus file exists', function () {

        test.it('should add itself to the dependency graph', function () {

          var model = new test.deps.Model({
            'path': 'foo/bar',
            'raw': '@import "foo"\n@import "bar"'
          });
          var dependencies = new test.deps.Model();
          instance.parse(model, null, dependencies);

          expect(_.keys(dependencies.attributes).length).to.equal(3);

          var wasFound = false;
          _.each(dependencies.attributes, function (arr, path) {
            if (path.indexOf('foo/bar') >= 0) {

              wasFound = true;
              expect(arr.length).to.equal(1);
              expect(arr[0].attributes.path).to.include('foo/bar');
            }
          });

          expect(wasFound).to.be.true;
        });

        test.it('should register the model as a node of the stylus file in the dependency graph', function () {

          var model = new test.deps.Model({
            'path': 'foo/bar',
            'raw': '@import "foo"'
          });
          var dependencies = new test.deps.Model();
          instance.parse(model, null, dependencies);

          expect(_.keys(dependencies.attributes).length).to.equal(2);

          var wasFound = false;
          _.each(dependencies.attributes, function (arr, path) {
            if (path.indexOf('foo.styl') >= 0) {
              wasFound = true;
              expect(arr.length).to.equal(1);
              expect(arr[0].attributes.path).to.include('foo/bar');
            }
          });

          expect(wasFound).to.be.true;
        });

        test.when('the imported stylesheet includes includes @import statements', function () {

          test.it('should register the model as a dependency of the nested stylesheet', function () {

            var model = new test.deps.Model({
              'path': 'foo/bar',
              'raw': '@import "includer"'
            });
            var dependencies = new test.deps.Model();
            instance.parse(model, null, dependencies);

            expect(_.keys(dependencies.attributes).length).to.equal(3);

            var wasFound = false;
            _.each(dependencies.attributes, function (arr, path) {
              if (path.indexOf('foo.styl') >= 0) {
                wasFound = true;
                expect(arr.length).to.equal(1);
                expect(arr[0].attributes.path).to.include('foo/bar');
              }
            });

            expect(wasFound).to.be.true;
          });
        });
      });

      test.when('the imported stylus file does not exist', function () {

        test.it('should throw error', function () {
          var model = new test.deps.Model({
            'path': 'foo/bar'
          });
          var dependencies = new test.deps.Model();
          expect(function () {
            instance.parse(model, '@import "notExisting"', dependencies);
          }).to.throw(Error);
        });
      });
    });
  });
});