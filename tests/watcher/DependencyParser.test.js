test('watcher/DependencyParser', [

  '../../lib/watcher/DependencyParser',
  '../../lib/core/Model',
  'lodash'

], function (runner) {

  var instance, _;

  runner.beforeEach(function () {
    instance = new runner.deps.DependencyParser();
    _ = runner.deps.lodash;
  });

  runner.afterEach(function () {
    instance.destroy();
  });

  runner.spec('parse ()', function () {

    runner.it('should throw an error', function () {

      expect(function () {
        instance.parse();
      }).to.throw(Error);
    });
  });

  runner.spec('add (object model, string path, object dependencies)', function () {

    runner.when('model is not a valid model', function () {

      runner.it('should throw an error', function () {

        var dependencies = new runner.deps.Model();
        expect(function () {
          instance.add({}, 'foo', dependencies);
        }).to.throw(Error);
      });
    });

    runner.when('path is not a string', function () {

      runner.it('should throw an error', function () {

        var model = new runner.deps.Model();
        var dependencies = new runner.deps.Model();
        expect(function () {
          instance.add(model, null, dependencies);
        }).to.throw(Error);
      });
    });

    runner.when('dependencies is not a valid model', function () {

      runner.it('should throw an error', function () {

        var model = new runner.deps.Model();
        expect(function () {
          instance.add(model, 'null');
        }).to.throw(Error);
      });
    });

    runner.when('valid options are provided', function () {

      runner.when('model is not already registered as a dependency of path', function () {

        runner.it('it should add model as a dependency of path', function () {

          var model = new runner.deps.Model({
            'id': 'foo',
            'bar': 'baz'
          });
          var watcherModel = new runner.deps.Model();

          var UsableClass = runner.deps.DependencyParser.extend({
            'parse': function () {}
          });
          instance = new UsableClass();

          var path = 'foo/bar/baz/boo';
          instance.add(model, path, watcherModel);
          var deps = watcherModel.get(process.cwd() + '/' + path);
          var found = _.find(deps, function (dep) {
            return dep.id = model.id;
          });
          expect(found.id).to.equal(model.id);
        });
      });

      runner.when('model is already registered as a dependency of path', function () {

        runner.it('it should not add model again', function () {

          var model = new runner.deps.Model({
            'id': 'foo',
            'bar': 'baz'
          });
          var watcherModel = new runner.deps.Model();

          var UsableClass = runner.deps.DependencyParser.extend({
            'parse': function () {}
          });
          instance = new UsableClass();

          var path = 'foo/bar/baz/boo';
          instance.add(model, path, watcherModel);
          instance.add(model, path, watcherModel);
          instance.add(model, path, watcherModel);
          instance.add(model, path, watcherModel);
          instance.add(model, path, watcherModel);
          var deps = watcherModel.get(process.cwd() + '/' + path);
          var found = _.filter(deps, function (dep) {
            return dep.id === model.id;
          }) || [];
          expect(found.length).to.equal(1);
          expect(deps.length).to.equal(1);
        });
      });
    });
  });
});