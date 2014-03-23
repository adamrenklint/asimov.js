test([

  '../../lib/parsers/ScriptParser',
  '../../lib/core/Model',
  'lodash'

], function (test) {

  var instance, _;

  test.beforeEach(function () {
    instance = new test.deps.ScriptParser({
      'paths': {
        'scripts': ['site/scripts']
      }
    });
    _ = test.deps.lodash;
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('parse (object model, string rendered, object dependencies)', function () {

    test.it('should add model as a dependency of itself', function (done) {

      var model = new test.deps.Model({
        'path': 'foo/bar.js',
        'url': '/foo/bar.js',
        'rendered': ''
      });
      var dependencies = new test.deps.Model();

      instance.parse(model, null, dependencies);

      expect(_.keys(dependencies.attributes).length).to.equal(1);

      var found = _.find(dependencies.attributes, function (graph, path) {
        if (path.indexOf('foo/bar.js') >= 0) {
          var inner = _.find(graph, function (node) {
            if (node.attributes.path.indexOf('foo/bar.js') >= 0) {
              done();
            }
          });
        }
      });
    });

    test.it('should register the model as a node of the script file in the dependency graph', function () {

        var model = new test.deps.Model({
          'path': 'foo/bar.js',
          'rendered': ';define("site/scripts/bootstrap", '
        });
        var dependencies = new test.deps.Model();
        instance.parse(model, null, dependencies);

        expect(_.keys(dependencies.attributes).length).to.equal(2);

        var wasFound = false;
        _.each(dependencies.attributes, function (arr, path) {
          if (path.indexOf('site/scripts/bootstrap.js') >= 0) {
            wasFound = true;
            expect(arr[0].attributes.path).to.include('foo/bar.js');
          }
        });

        expect(wasFound).to.be.true;
      });
  });
});