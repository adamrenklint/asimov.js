test([

  '../../lib/parsers/ScriptParser',
  '../../lib/core/Model',
  'lodash'

], function (test) {

  var instance, _;

  test.beforeEach(function () {
    instance = new test.deps.ScriptParser({
      // 'paths': {
      //   'styles': ['tests/mocks/styles']
      // }
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
        'url': '/foo/bar.js'
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
  });
});