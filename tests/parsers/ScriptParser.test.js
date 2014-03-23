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

    test.it('should add model as a dependency of itself', function () {

      var model = new test.deps.Model({
        'path': 'foo/bar.js'
      });
      var dependencies = new test.deps.Model();

      instance.parse(model, null, dependencies);

      expect(_.keys(dependencies.attributes).length).to.equal(1);
      var first = dependencies.get('foo/bar.js')[0];
      expect(first && first.attributes.path).to.equal('foo/bar.js');
    });
  });
});