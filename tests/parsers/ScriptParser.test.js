var libPath = '../../lib/';
var ScriptParser = require(libPath + 'parsers/ScriptParser');
var Model = require(libPath + 'core/Model');
var Test = require(libPath + 'runner/Test');
var _ = require('lodash');

Test.run('parsers/ScriptParser', function (test) {

  var instance;

  test.beforeEach(function () {
    instance = new ScriptParser({
      'paths': {
        'scripts': ['lib']
      }
    });
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('parse (object model, string rendered, object dependencies)', function () {

    test.it('should add model as a dependency of itself', function (done) {

      var model = new Model({
        'path': 'foo/bar.js',
        'url': '/foo/bar.js',
        'unminified': ''
      });
      var dependencies = new Model();

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

        var model = new Model({
          'path': 'lib/applications/Main/Application.js',
          'unminified': ';require("./Router");'
        });
        var dependencies = new Model();
        instance.parse(model, null, dependencies);

        expect(_.keys(dependencies.attributes).length).to.equal(2);

        var wasFound = false;
        _.each(dependencies.attributes, function (arr, path) {
          if (path.indexOf('lib/applications/Main/Router.js') >= 0) {
            wasFound = true;
            expect(arr[0].attributes.path).to.include('lib/applications/Main/Application.js');
          }
        });

        expect(wasFound).to.be.true;
      });
  });
});